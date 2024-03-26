<template>
  <div>
    <client-only>
      <main-slider v-if="!isMobile && bettingContent?.sliderDisplay" sliderType="low" />
    </client-only>

    <div class="betting">
      <div id="betting-container" class="container"/>
      
      <atomic-seo-text v-if="bettingContent?.pageMeta?.seoText" v-bind="bettingContent?.pageMeta?.seoText"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ISportsbookPage } from '~/types';

  const showPlug = ref<boolean>(false);
  const globalStore = useGlobalStore();
  const {
    isMobile,
    alertsData,
    defaultLocaleAlertsData,
    currentLocale,
    defaultLocale,
    headerCountry
  } = storeToRefs(globalStore);

  const {
    setPageMeta,
    getLocalesContentData,
    localizePath,
    addBetsyScript
  } = useProjectMethods();

  const bettingContent = ref<Maybe<ISportsbookPage>>();
  const  defaultLocaleBettingContent = ref<Maybe<ISportsbookPage>>();

  interface IPageContent {
    currentLocaleData: Maybe<ISportsbookPage>;
    defaultLocaleData: Maybe<ISportsbookPage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    bettingContent.value = contentData?.currentLocaleData;
    defaultLocaleBettingContent.value = contentData?.defaultLocaleData;
    setPageMeta(bettingContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('sportsbookPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'sportsbook').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'sportsbook').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('sportsbookPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })
  
  const dayjs = useDayjs();
  const sliderFilterTime = ref(dayjs.utc());
  const filteredSlider = computed(() => {
    return bettingContent.value?.slider?.items?.reduce((filteredSliderArr: ISportsbookPage['slider']['items'], currentSlide) => {
      const loggedFilter: boolean = (isLoggedIn.value && currentSlide.loggedHide) || (!isLoggedIn.value && currentSlide.unloggedHide);
      let includesSegmentsFilter: boolean = !!currentSlide.showSegments?.length;
      let excludeSegmentsFilter: boolean = !!currentSlide.hideSegments?.length;
      let timeFilter: boolean = false;
      
      if (isLoggedIn.value && profile.value) {
        const showSegmentsArr = currentSlide.showSegments?.map(item => item.segmentName) || [];
        const hideSegmentsArr = currentSlide.hideSegments?.map(item => item.segmentName) || [];
        includesSegmentsFilter = showSegmentsArr.length ? !profile.value.segments.some((segment) => showSegmentsArr.includes(segment.name)) : false;
        excludeSegmentsFilter = hideSegmentsArr.length ? profile.value.segments.some((segment) => hideSegmentsArr.includes(segment.name)) : false;
      }
      
      if (currentSlide.showFrom && currentSlide.showTo) {
        timeFilter = !dayjs(sliderFilterTime.value).isBetween(dayjs(currentSlide.showFrom), dayjs(currentSlide.showTo), 'second');
      } else if (currentSlide.showFrom) {
        timeFilter = !dayjs(sliderFilterTime.value).isSameOrAfter(dayjs(currentSlide.showFrom), 'second');
      } else if (currentSlide.showTo) {
        timeFilter = !dayjs(sliderFilterTime.value).isSameOrBefore(dayjs(currentSlide.showTo), 'second');
      }
      
      if (loggedFilter || includesSegmentsFilter || excludeSegmentsFilter || timeFilter) return filteredSliderArr;
      return [...filteredSliderArr, currentSlide];
    }, []);
  })

  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);

  const { getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const {
    isLoggedIn,
    profile
  } = storeToRefs(profileStore);

  const sdkDefaultParams = {
    containerId: 'betting-container',
    width: '100%',
    height: '100%',
    parent: false,
  };

  const frame = ref<Promise<any>>();
  const runtimeConfig = useRuntimeConfig();
  const updateUrlParam = runtimeConfig.public?.betsyParams?.allowParentUrlUpdate;
  const startBetsyFrame = (host: string, token: string): void => {
    const params = {
      ...sdkDefaultParams,
      host: runtimeConfig.public.betsyParams?.clientHost,
      cid: runtimeConfig.public.betsyParams?.clientId,
      theme: runtimeConfig.public.betsyParams?.sportsBookTheme,
      customStyles: runtimeConfig.public.betsyParams?.sportsBookStyles ? `${host}${runtimeConfig.public.betsyParams.sportsBookStyles}` : undefined,
      token: isLoggedIn.value ? token : null,
      lang: currentLocale.value?.code || 'en',
      allowParentUrlUpdate: updateUrlParam ?? false
    };

    if (window.BetSdk) {
      frame.value = window.BetSdk.init(params);
    } else {
      const betsyScript = addBetsyScript();
      betsyScript.onload = () => {
        frame.value = window.BetSdk.init(params);
      };
    }
  }

  const startGame = async (): Promise<void> => {
    const mainHost = window.location.origin;
    const startParams = {
      accountId: activeAccount.value?.id,
      lobbyUrl: mainHost,
      locale: currentLocale.value?.code || 'en',
      countryCode: profile.value?.country || headerCountry.value || 'UA',
      demoMode: false,
      platform: isMobile.value ? 1 : 2,
    };
    const startResponse = await getStartGame('betsy-sportsbook-betsy', startParams);
    startBetsyFrame(mainHost, startResponse.token);
  };

  const layoutStore = useLayoutStore();
  const {
    showAlert,
    compactDrawer,
  } = layoutStore;

  const router = useRouter();
  const { showModal } = useLimitsStore();

  const redirectLimitedPlayer = (): void => {
    router.replace(localizePath('/'));
    showAlert(alertsData.value?.limit?.limitedRealGame || defaultLocaleAlertsData.value?.limit?.limitedRealGame);
  };

  watch(() => activeAccount.value?.id, async (oldValue, newValue) => {
    if (oldValue && newValue && oldValue !== newValue) await startGame();
  });

  onBeforeMount(() => {
    compactDrawer(true, false);
  });

  const route = useRoute();
  const routerIframePath = ref<string|undefined>(route.query.setIframePath as string|undefined);
  const changeFramePath = async (setIframePath: string|undefined): Promise<void> => {
    const betsyFrame = await frame.value;
    betsyFrame.sendMessage({
      type: 'routeChange',
      data: {
        route: setIframePath || '/',
      },
    });
  }

  watch(() => route.query.setIframePath, async (newValue) => {
    if (!updateUrlParam || (routerIframePath.value === newValue)) return;
    await changeFramePath(route.query.setIframePath as string|undefined);
  })

  const updateRouterIframePath = ({ data }: { data: any }) => {
    if (typeof data === 'string') {
      const messageData = JSON.parse(data);

      if (messageData.type === 'route') {
        const currentIframePath = route.query.setIframePath as string|undefined;
        routerIframePath.value = messageData.location === '/' ? undefined : messageData.location;

        if (currentIframePath !== routerIframePath.value) {
          router.push({ query: { ...route.query, setIframePath: routerIframePath.value } });
        }
      }
    }
  }

  onMounted(async () => {
    if (updateUrlParam) window.addEventListener('message', updateRouterIframePath);

    if (isMobile.value) {
      const footerEl: HTMLElement | null = document.querySelector('footer');
      if (footerEl) footerEl.style.display = 'none';
      const seoTextBlock: HTMLElement | null = document.querySelector('.text-wrap');
      if (seoTextBlock) seoTextBlock.style.display = 'none';
    }

    try {
      await startGame();
    } catch (error: any) {
      if ([14100, 14101, 14105].includes(error.data?.error?.code)) {
        await router.push({
          path: localizePath('/profile/limits'),
          query: {}
        });
        showModal('gameLimitReached');
      } else if (error.data?.error?.code === 14103) {
        redirectLimitedPlayer();
      } else {
        throw error;
      }
    }
  });

  watch(() => isLoggedIn.value, async (newValue: boolean) => {
    if (!newValue) {
      return;
    }

    try {
      await startGame();
    } catch (error: any) {
      if ([14100, 14101, 14105].includes(error.data?.error?.code)) {
        await router.push({
          path: localizePath('/profile/limits'),
          query: {}
        });
        showModal('gameLimitReached');
      } else if (error.data?.error?.code === 14103) {
        redirectLimitedPlayer();
      } else {
        throw error;
      }
    } finally {
      showPlug.value = false;
    }
  });

  onBeforeUnmount(() => {
    if (updateUrlParam) window.removeEventListener('message', updateRouterIframePath);

    const footerEl: any = document.querySelector('footer');
    if (footerEl) footerEl.style.display = null;
    const seoTextBlock: any = document.querySelector('.text-wrap');
    if (seoTextBlock) seoTextBlock.style.display = null;

    const storageDrawerCompact = localStorage.getItem('IS_DRAWER_COMPACT') === 'true';
    compactDrawer(storageDrawerCompact, false);
  });
</script>

<style src="~/assets/styles/pages/betting.scss" lang="scss"/>

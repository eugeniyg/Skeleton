<template>
  <div class="betting">
    <div id="betting-container" class="container"/>

    <atomic-seo-text v-if="bettingContent?.seo?.text" v-bind="bettingContent?.seo?.text"/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ISportsbookPage } from '~/types';

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
    setPageSeo,
    getLocalesContentData,
  } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleSportsbookPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'sportsbook')
      .findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleSportsbookPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'sportsbook')
        .findOne())
  ]);

  const {
    currentLocaleData,
    defaultLocaleData
  } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const bettingContent: Maybe<ISportsbookPage> = currentLocaleData;

  setPageSeo(bettingContent?.seo);

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

  const startGame = async (): Promise<void> => {
    const runtimeConfig = useRuntimeConfig();
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

    const loggedOutClientId = 'turbodemo';

    const params = {
      ...sdkDefaultParams,
      host: runtimeConfig.public.betsyParams?.clientHost,
      cid: isLoggedIn.value ? runtimeConfig.public.betsyParams?.clientId : loggedOutClientId,
      theme: runtimeConfig.public.betsyParams?.sportsBookTheme,
      customStyles: runtimeConfig.public.betsyParams?.sportsBookStyles ? `${mainHost}${runtimeConfig.public.betsyParams.sportsBookStyles}` : undefined,
      token: isLoggedIn.value ? startResponse.token : null,
      lang: currentLocale.value?.code || 'en',
    };

    if (window.BetSdk) window.BetSdk.init(params);
  };

  const layoutStore = useLayoutStore();
  const {
    showAlert,
    compactDrawer,
  } = layoutStore;

  const router = useRouter();
  const { localizePath } = useProjectMethods();
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

  onMounted(async () => {
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
    const footerEl: any = document.querySelector('footer');
    if (footerEl) footerEl.style.display = null;
    const seoTextBlock: any = document.querySelector('.text-wrap');
    if (seoTextBlock) seoTextBlock.style.display = null;

    const storageDrawerCompact = localStorage.getItem('IS_DRAWER_COMPACT') === 'true';
    compactDrawer(storageDrawerCompact, false);
  });
</script>

<style src="~/assets/styles/pages/betting.scss" lang="scss"/>

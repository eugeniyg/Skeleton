<template>
  <div>
    <client-only>
      <main-slider v-if="!isMobile && pageContent?.currentLocaleData?.sliderDisplay" slider-type="low" />
    </client-only>

    <div class="betting">
      <div id="betting-container" class="container" />

      <atomic-seo-text
        v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
        v-bind="pageContent.currentLocaleData.pageMeta.seoText"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ISportsbookPage } from '~/types';

  const showPlug = ref<boolean>(false);
  const globalStore = useGlobalStore();
  const { isMobile, alertsData, defaultLocaleAlertsData, currentLocale, headerCountry } = storeToRefs(globalStore);

  const { localizePath, addBetsyScript } = useProjectMethods();
  const contentParams = {
    contentKey: 'sportsbookPageContent',
    contentRoute: ['pages', 'sportsbook'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<ISportsbookPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);

  const { getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);
  const { openModal } = useModalStore();

  const sdkDefaultParams = {
    containerId: 'betting-container',
    width: '100%',
    height: '100%',
    parent: false,
    loginUrl: 'sendPostMessage',
    allowToChangeParentStyles: true,
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
      customStyles: runtimeConfig.public.betsyParams?.sportsBookStyles
        ? `${host}${runtimeConfig.public.betsyParams.sportsBookStyles}`
        : undefined,
      token: isLoggedIn.value ? token : null,
      lang: currentLocale.value?.code || 'en',
      allowParentUrlUpdate: updateUrlParam ?? false,
    };

    if (window.BetSdk) {
      frame.value = window.BetSdk.init(params);
    } else {
      const betsyScript = addBetsyScript();
      betsyScript.onload = () => {
        frame.value = window.BetSdk.init(params);
      };
    }
  };

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

    try {
      const startResponse = await getStartGame('betsy-sportsbook-betsy', startParams);
      startBetsyFrame(mainHost, startResponse.token);
    } catch (error: any) {
      if ([14100, 14101, 14105].includes(error.data?.error?.code)) {
        await openModal('game-limit-reached');
        await router.push({
          path: localizePath('/profile/limits'),
          query: {},
        });
      } else if (error.data?.error?.code === 14103) {
        redirectLimitedPlayer();
      } else if (error.data?.error?.code === 14306) {
        await openModal('restricted-bets');
      } else {
        throw error;
      }
    }
  };

  const layoutStore = useLayoutStore();
  const { showAlert, compactDrawer } = layoutStore;

  const router = useRouter();
  const redirectLimitedPlayer = (): void => {
    router.replace(localizePath('/'));
    showAlert(alertsData.value?.limit?.limitedRealGame || defaultLocaleAlertsData.value?.limit?.limitedRealGame);
  };

  // watch(
  //   () => activeAccount.value?.id,
  //   async (oldValue, newValue) => {
  //     if (oldValue && newValue && oldValue !== newValue) await startGame();
  //   }
  // );

  onBeforeMount(() => {
    compactDrawer(true, false);
  });

  const route = useRoute();
  const routerIframePath = ref<string | undefined>(route.query.setIframePath as string | undefined);
  const changeFramePath = async (setIframePath: string | undefined): Promise<void> => {
    const betsyFrame = await frame.value;
    betsyFrame.sendMessage({
      type: 'routeChange',
      data: {
        route: setIframePath || '/',
      },
    });
  };

  // watch(
  //   () => route.query.setIframePath,
  //   async newValue => {
  //     if (!updateUrlParam || routerIframePath.value === newValue) return;
  //     await changeFramePath(route.query.setIframePath as string | undefined);
  //   }
  // );

  const updateRouterIframePath = (eventData: { type: string; location: string }) => {
    const currentIframePath = route.query.setIframePath as string | undefined;
    routerIframePath.value = eventData.location === '/' ? undefined : eventData.location;

    if (currentIframePath !== routerIframePath.value) {
      router.push({ query: { ...route.query, setIframePath: routerIframePath.value } });
    }
  };

  const resolveFrameEvent = ({ data }: { data: any }) => {
    if (typeof data === 'string') {
      const eventData = JSON.parse(data);

      if (updateUrlParam && eventData.type === 'route') updateRouterIframePath(eventData);

      const { isLoggedIn } = useProfileStore();
      const showLoginModal = eventData.type === 'click' && eventData.target === 'loginButton' && !isLoggedIn;
      if (showLoginModal) openModal('sign-in');
    }
  };

  const handleRestrictedBets = (gameIdentity: string): void => {
    if (gameIdentity && gameIdentity === 'betsy-sportsbook-betsy') {
      openModal('restricted-bets');
    }
  };

  const handleMaxBets = ({ gameIdentity, maxBet }: { gameIdentity: string; maxBet: string }): void => {
    if (gameIdentity && gameIdentity === 'betsy-sportsbook-betsy') {
      openModal('max-bets', { props: { maxBet } });
    }
  };

  onMounted(async () => {
    // window.addEventListener('message', resolveFrameEvent);
    //
    // if (isMobile.value) {
    //   const footerEl: HTMLElement | null = document.querySelector('footer');
    //   if (footerEl) footerEl.style.display = 'none';
    //   const seoTextBlock: HTMLElement | null = document.querySelector('.text-wrap');
    //   if (seoTextBlock) seoTextBlock.style.display = 'none';
    // }
    //
    // await startGame();
    // useListen('restrictedBets', handleRestrictedBets);
    // useListen('maxBets', handleMaxBets);
    if (window.Sportsbook) {
      window.Sportsbook.init({
        host: 'https://video-test-stage.betsy.software',
        containerId: 'betting-container',
        cid: 'black_demo',
        allowToChangeParentStyles: true,
      });
    }
  });

  // watch(
  //   () => isLoggedIn.value,
  //   async (newValue: boolean) => {
  //     if (!newValue) {
  //       return;
  //     }
  //
  //     await startGame();
  //     showPlug.value = false;
  //   }
  // );

  onBeforeUnmount(() => {
    // window.removeEventListener('message', resolveFrameEvent);
    //
    // const footerEl: any = document.querySelector('footer');
    // if (footerEl) footerEl.style.display = null;
    // const seoTextBlock: any = document.querySelector('.text-wrap');
    // if (seoTextBlock) seoTextBlock.style.display = null;

    const storageDrawerCompact = localStorage.getItem('IS_DRAWER_COMPACT') === 'true';
    compactDrawer(storageDrawerCompact, false);
    // useUnlisten('restrictedBets', handleRestrictedBets);
  });
</script>

<style src="~/assets/styles/pages/betting.scss" lang="scss" />

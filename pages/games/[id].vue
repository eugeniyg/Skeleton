<template>
  <div>
    <box-game
      v-if="gameInfo"
      :frameLink="gameStart"
      :gameInfo="gameInfo"
      @changeMode="changeGameMode"
      :gameContent="gameContent || defaultLocaleGameContent"
      :showPlug="showPlug && !isLoggedIn && !gameInfo.isDemoMode"
      :isDemo="isDemo"
    />

    <modal-demo-game
      :content="gameContent?.demoModal || defaultLocaleGameContent?.demoModal"
      :isDemo="isDemo"
      @playReal="changeGameMode"
    />

    <atomic-seo-text v-if="gameContent?.seo?.text" v-bind="gameContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IGame } from '@skeleton/core/types';
  import type { IGamePage } from '~/types';

  const route = useRoute();
  const showPlug = ref<boolean>(false);
  const isDemo = ref<boolean>(route.query.real !== 'true');
  const gameStart = ref<string>();
  const { getGamesInfo, getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);
  const {
    showModal,
    showAlert,
    compactDrawer,
    setReturnGame,
    openWalletModal
  } = useLayoutStore();
  const { activeAccount } = storeToRefs(walletStore);
  const globalStore = useGlobalStore();
  const {
    isMobile,
    alertsData,
    defaultLocaleAlertsData,
    currentLocale,
    defaultLocale,
    headerCountry
  } = storeToRefs(globalStore);

  const { setPageSeo, getLocalesContentData } = useProjectMethods();

  const gameInfo = ref<Maybe<IGame>>();
  const gameContent = ref<Maybe<IGamePage>>();
  const defaultLocaleGameContent = ref<Maybe<IGamePage>>();

  interface IPageData {
    gameInfo: Maybe<IGame>;
    currentLocaleData: Maybe<IGamePage>;
    defaultLocaleData: Maybe<IGamePage>;
  }

  const setContentData = (contentData: Maybe<IPageData>): void => {
    gameInfo.value = contentData?.gameInfo;
    gameContent.value = contentData?.currentLocaleData;
    defaultLocaleGameContent.value = contentData?.defaultLocaleData;
    setPageSeo(gameContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageData> => {
    const nuxtPageData = useNuxtData(`game${route.params.id}Info`);
    if (nuxtPageData.data.value) return nuxtPageData.data.value;

    const [infoResponse, currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      getGamesInfo(route.params.id as string),
      queryContent(currentLocale.value?.code as string, 'pages', 'game').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'game').findOne()
    ]);
    const contentResponseData = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
    const gameInfo = infoResponse.status !== 'rejected' ? infoResponse.value : undefined;
    return reactive({ gameInfo, ...contentResponseData });
  }

  const { pending, data } = await useLazyAsyncData(`game${route.params.id}Info`, () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
    if (pageMounted.value) checkGame();
  })

  const router = useRouter();

  const gameLoading = ref<boolean>(false);
  const startGame = async ():Promise<{
    data?: { gameUrl: string; token: string; },
    error?: any
  }> => {
    gameLoading.value = true;
    const limitsStore = useLimitsStore();
    const redirectUrl = window.location.origin + (window.history.state.back || '');
    const startParams = {
      accountId: isDemo.value ? undefined : activeAccount.value?.id,
      lobbyUrl: redirectUrl,
      locale: currentLocale.value?.code || 'en',
      countryCode: profile.value?.country || headerCountry.value || 'UA',
      demoMode: isDemo.value,
      platform: isMobile.value ? 1 : 2,
    };

    try {
      const startResponse = await getStartGame(route.params.id as string, startParams);
      gameStart.value = startResponse.gameUrl;
      return { data: startResponse }
    } catch (err: any) {
      if ([14100, 14101, 14105].includes(err.data?.error?.code)) {
        const { localizePath } = useProjectMethods();
        await router.push({ path: localizePath('/profile/limits'), query: {} });
        limitsStore.showModal('gameLimitReached');
        return { error: { ...err, fatal: false }}
      }

      if(err.data?.error?.code === 14103) {
        redirectLimitedPlayer();
        return { error: { ...err, fatal: false }}
      }

      return { error: { ...err, fatal: true } }
    } finally {
      gameLoading.value = false;
    }
  };

  const changeGameMode = async ():Promise<void> => {
    if (gameLoading.value) return;

    if (isDemo.value && !isLoggedIn.value) {
      showModal('register');
      return;
    }

    isDemo.value = false;

    const { data, error } = await startGame();
    if (data) router.replace({ query: { real: `${!isDemo.value}` } });
    else if (error.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  };

  const redirectLimitedPlayer = () :void => {
    const { localizePath } = useProjectMethods();
    router.push(localizePath('/'));
    showAlert(alertsData.value?.limit?.limitedRealGame || defaultLocaleAlertsData.value?.limit?.limitedRealGame);
  };

  const checkDepositModal = (): void => {
    const { mobileGameModalInfo } = useGamesStore();
    if (isLoggedIn.value && !isDemo.value && !activeAccount.value?.balance && !mobileGameModalInfo) {
      openWalletModal('deposit');
    }
  }

  watch(() => isLoggedIn.value, async (newValue:boolean) => {
    if (!newValue) return;

    showPlug.value = false;
    if (isDemo.value) {
      await changeGameMode();
    } else {
      const { error } = await startGame();
      if (error?.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
    }
  });

  watch(() => activeAccount.value?.id, async (oldValue, newValue) => {
    if (oldValue && newValue && oldValue !== newValue) {
      const { error } = await startGame();
      if (error?.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
    }
  });

  const checkGame = async (): Promise<void> => {
    if (!isDemo.value && !isLoggedIn.value) {
      if (gameInfo.value?.isDemoMode) await changeGameMode();
      else showPlug.value = true;
    } else {
      const { error } = await startGame();
      if (error?.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });

      checkDepositModal()
    }
  }

  const pageMounted = ref<boolean>(false);
  onMounted(async () => {
    document.body.classList.add('is-mob-nav-vertical');
    document.body.classList.add('is-game-page');
    useListen('changeMobileGameMode', changeGameMode);
    compactDrawer(true, false);

    if (gameInfo.value) await checkGame();
    pageMounted.value = true;
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('is-mob-nav-vertical');
    document.body.classList.remove('is-game-page');

    if (isLoggedIn.value && !isDemo.value) setReturnGame(gameInfo.value);
    const storageDrawerCompact = localStorage.getItem('IS_DRAWER_COMPACT') === 'true';
    compactDrawer(storageDrawerCompact, false);
    useUnlisten('changeMobileGameMode', changeGameMode);
  });
</script>

<style src="~/assets/styles/pages/games/game.scss" lang="scss" />

<template>
  <div>
    <box-game
      v-if="gameInfo"
      :frame-link="gameStart"
      :game-info="gameInfo"
      :game-content="pageContent?.currentLocaleData || pageContent?.defaultLocaleData"
      :show-plug="showPlug && !isLoggedIn && !gameInfo.isDemoMode"
      :is-demo="isDemo"
      @change-mode="changeGameMode"
    />

    <transition name="fade-up" mode="out-in">
      <loyalty-new-level-notif v-if="levelNotificationEnabled" />
    </transition>

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IGamePage } from '~/types';

  const route = useRoute();
  const showPlug = ref<boolean>(false);
  const isDemo = ref<boolean>(route.query.real !== 'true');
  const gameStart = ref<string>();
  const { getGamesInfo, getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);
  const { showAlert, compactDrawer, setReturnGame } = useLayoutStore();
  const { openModal, openWalletModal } = useModalStore();
  const { activeAccount } = storeToRefs(walletStore);
  const globalStore = useGlobalStore();
  const { isMobile, alertsData, defaultLocaleAlertsData, currentLocale, headerCountry } = storeToRefs(globalStore);
  const loyaltyStore = useLoyaltyStore();
  const { levelNotificationEnabled } = storeToRefs(loyaltyStore);

  const contentParams = {
    contentKey: 'gamePageContent',
    contentRoute: ['pages', 'game'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IGamePage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
  const { data: gameInfo } = await useLazyAsyncData(`game${route.params.id}Info`, () =>
    getGamesInfo(route.params.id as string)
  );

  watch(gameInfo, () => {
    if (pageMounted.value) checkGame();
  });

  const router = useRouter();

  const gameLoading = ref<boolean>(false);
  const startGame = async (): Promise<{
    data?: { gameUrl: string; token: string };
    error?: any;
  }> => {
    gameLoading.value = true;
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
      return { data: startResponse };
    } catch (err: any) {
      if ([14100, 14101, 14105].includes(err.data?.error?.code)) {
        const { localizePath } = useProjectMethods();
        await openModal('game-limit-reached');
        await router.push({ path: localizePath('/profile/limits'), query: {} });
        return { error: { ...err, fatal: false } };
      }

      if (err.data?.error.code === 14308) {
        await openModal('geo-restricted-game');
        return { error: { ...err, fatal: false } };
      }

      if (err.data?.error?.code === 14103) {
        redirectLimitedPlayer();
        return { error: { ...err, fatal: false } };
      }

      if (err.data?.error?.code === 14306) {
        await openModal('restricted-bets');
        return { error: { ...err, fatal: false } };
      }

      return { error: { ...err, fatal: true } };
    } finally {
      gameLoading.value = false;
    }
  };

  const changeGameMode = async (): Promise<void> => {
    if (gameLoading.value) return;

    if (isDemo.value && !isLoggedIn.value) {
      await openModal('sign-up');
      return;
    }

    isDemo.value = !isDemo.value;

    const { data, error } = await startGame();
    if (data) router.replace({ query: { real: `${!isDemo.value}` } });
    else {
      if (error.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
      isDemo.value = !isDemo.value;
    }
  };

  const redirectLimitedPlayer = (): void => {
    const { localizePath } = useProjectMethods();
    router.push(localizePath('/'));
    showAlert(alertsData.value?.limit?.limitedRealGame || defaultLocaleAlertsData.value?.limit?.limitedRealGame);
  };

  const gamesStore = useGamesStore();
  const { mobileGameModalInfo } = storeToRefs(gamesStore);
  const checkDepositModal = (): void => {
    if (isLoggedIn.value && !isDemo.value && !activeAccount.value?.balance && !mobileGameModalInfo.value) {
      openWalletModal('deposit');
    }
  };

  watch(
    () => isLoggedIn.value,
    async (newValue: boolean) => {
      if (!newValue) return;

      showPlug.value = false;
      if (isDemo.value) {
        await changeGameMode();
      } else {
        const { error } = await startGame();
        if (error?.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
      }
    }
  );

  watch(
    () => activeAccount.value?.id,
    async (oldValue, newValue) => {
      if (oldValue && newValue && oldValue !== newValue) {
        const { error } = await startGame();
        if (error?.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
      }
    }
  );

  const checkGame = async (): Promise<void> => {
    if (!isDemo.value && !isLoggedIn.value) {
      if (gameInfo.value?.isDemoMode) await changeGameMode();
      else showPlug.value = true;
    } else {
      const { error } = await startGame();
      if (error?.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });

      checkDepositModal();
    }
  };

  const handleRestrictedBets = (gameIdentity: string): void => {
    if (gameIdentity && gameIdentity === route.params.id && !isDemo.value) {
      openModal('restricted-bets');
    }
  };

  const handleMaxBets = ({ gameIdentity, maxBet }: { gameIdentity: string; maxBet: string }): void => {
    if (gameIdentity && gameIdentity === route.params.id && !isDemo.value) {
      openModal('max-bets', { props: { maxBet, onClosed: closeMaxBetModal } });
    }
  };

  const closeMaxBetModal = async (): Promise<void> => {
    const { name: closeContextRouteName } = useRoute();
    if (closeContextRouteName !== 'games-id' && closeContextRouteName !== 'locale-games-id') return;
    const { error } = await startGame();
    if (error?.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  };

  const timer = ref<any>();
  const startTimer = (): void => {
    timer.value = setTimeout(() => {
      openModal('demo-game', { props: { onPlayReal: changeGameMode } });
    }, 60000);
  };

  onBeforeMount(() => {
    if (isDemo.value) {
      if (!isLoggedIn.value && !mobileGameModalInfo.value) {
        openModal('demo-game', { props: { onPlayReal: changeGameMode } });
      }
      startTimer();
    }
  });

  watch(isDemo, (newValue: boolean) => {
    if (!newValue) clearTimeout(timer.value);
  });

  const pageMounted = ref<boolean>(false);
  onMounted(async () => {
    document.body.classList.add('is-mob-nav-vertical');
    document.body.classList.add('is-game-page');
    useListen('changeMobileGameMode', changeGameMode);
    compactDrawer(true, false);

    if (gameInfo.value) await checkGame();
    useListen('restrictedBets', handleRestrictedBets);
    useListen('maxBets', handleMaxBets);
    pageMounted.value = true;
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('is-mob-nav-vertical');
    document.body.classList.remove('is-game-page');

    if (isLoggedIn.value && !isDemo.value) setReturnGame(gameInfo.value);
    const storageDrawerCompact = localStorage.getItem('IS_DRAWER_COMPACT') === 'true';
    compactDrawer(storageDrawerCompact, false);
    useUnlisten('changeMobileGameMode', changeGameMode);
    useUnlisten('restrictedBets', handleRestrictedBets);
    clearTimeout(timer.value);
  });
</script>

<style src="~/assets/styles/pages/games/game.scss" lang="scss" />

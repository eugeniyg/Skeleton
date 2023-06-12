<template>
  <div>
    <box-game
      :frameLink="gameStart"
      :gameInfo="gameInfo"
      @changeMode="changeGameMode"
      :gameContent="gameContent || defaultLocaleGameContent"
      :showPlug="showPlug && !isLoggedIn && !gameInfo.isDemoMode"
    />
    <atomic-seo-text v-if="gameContent?.seo?.text" v-bind="gameContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { GameInterface } from '@platform/frontend-core/dist/module';
  import { GamePageInterface } from '@skeleton/types';

  const route = useRoute();
  const showPlug = ref<boolean>(false);
  const isDemo = ref<boolean>(route.query.real !== 'true');
  const gameInfo = ref<GameInterface>();
  const gameStart = ref<string>();
  const { getGamesInfo, getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);
  const { showModal, showAlert } = useLayoutStore();
  const { activeAccount } = storeToRefs(walletStore);
  const globalStore = useGlobalStore();
  const {
    isMobile,
    alertsData,
    defaultLocaleAlertsData,
    currentLocale,
    headerCountry,
    contentLocalesArray,
  } = storeToRefs(globalStore);

  const {
    setPageSeo,
    findLocalesContentData,
  } = useProjectMethods();

  const [infoResponse, gameContentRequest] = await Promise.all([
    useAsyncData('gameInfo', () => getGamesInfo(route.params.id as string)),
    useAsyncData('gameContent', () => queryContent('page-controls')
      .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'gamePage']).find()),
  ]);

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(gameContentRequest.data.value);
  const gameContent: Maybe<GamePageInterface> = currentLocaleData?.gamePage;
  const defaultLocaleGameContent: Maybe<GamePageInterface> = defaultLocaleData?.gamePage;
  setPageSeo(gameContent?.seo);
  gameInfo.value = infoResponse.data?.value as GameInterface;
  const router = useRouter();

  const startGame = async ():Promise<{
    data?: { gameUrl: string; token: string; },
    error?: any
  }> => {
    const { showModal } = useLimitsStore();
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
      if ([14100, 14101, 14103].includes(err.data?.error?.code)) {
        const { localizePath } = useProjectMethods();
        await router.push({ path: localizePath('/profile/limits'), query: {} });
        showModal('playerLimitedConfirm');
        return { error: { ...err, fatal: false }}
      }
      return { error: { ...err, fatal: true } }
    }
  };


  const changeGameMode = async ():Promise<void> => {
    if (isDemo.value && !isLoggedIn.value) {
      showModal('register');
      return;
    }

    // if (isDemo.value && profile.value?.status === 2) {
    //   showAlert(alertsData.value?.limitedRealGame || defaultLocaleAlertsData.value?.limitedRealGame);
    //   return;
    // }

    isDemo.value = !isDemo.value;

    const { data, error } = await startGame();
    if (data) router.replace({ query: { real: `${!isDemo.value}` } });
    else if (error.fatal) throw createError(error);
  };

  const redirectLimitedPlayer = ():void => {
    if (gameInfo.value?.isDemoMode) changeGameMode();
    else {
      const { localizePath } = useProjectMethods();
      router.push(localizePath('/'));
      showAlert(alertsData.value?.limitedRealGame || defaultLocaleAlertsData.value?.limitedRealGame);
    }
  };

  watch(() => isLoggedIn.value, async (newValue:boolean) => {
    if (!newValue) return;

    showPlug.value = false;
    if (!isDemo.value && profile.value?.status === 2) {
      setTimeout(() => {
        redirectLimitedPlayer();
      });
    } else if (isDemo.value) {
      await changeGameMode();
    } else {
      const { error } = await startGame();
      if (error?.fatal) throw createError(error);
    }
  });

  watch(() => activeAccount.value?.id, async (oldValue, newValue) => {
    if (oldValue && newValue && oldValue !== newValue) {
      const { error } = await startGame();
      if (error?.fatal) throw createError(error);
    }
  });

  onMounted(async () => {
    document.body.classList.add('is-mob-nav-vertical');
    document.body.classList.add('is-game-page');

    if (!isDemo.value && !isLoggedIn.value) {
      if (gameInfo.value?.isDemoMode) changeGameMode();
      else showPlug.value = true;
    } else if (!isDemo.value && profile.value?.status === 2) {
      redirectLimitedPlayer();
    } else {
      const { error } = await startGame();
      if (error?.fatal) throw createError(error);
    }
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('is-mob-nav-vertical');
    document.body.classList.remove('is-game-page');
  });
</script>

<style src="~/assets/styles/pages/games/game.scss" lang="scss" />

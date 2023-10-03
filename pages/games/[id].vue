<template>
  <div>
    <box-game
      :frameLink="gameStart"
      :gameInfo="gameInfo"
      @changeMode="changeGameMode"
      :gameContent="gameContent || defaultLocaleGameContent"
      :showPlug="showPlug && !isLoggedIn && !gameInfo.isDemoMode"
      :isDemo="isDemo"
    />
    <atomic-seo-text v-if="gameContent?.seo?.text" v-bind="gameContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IGame } from '@skeleton/core/types';
  import { IGamePage } from '~/types';

  const route = useRoute();
  const showPlug = ref<boolean>(false);
  const isDemo = ref<boolean>(route.query.real !== 'true');
  const gameInfo = ref<IGame>();
  const gameStart = ref<string>();
  const { getGamesInfo, getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);
  const { showModal, showAlert, compactDrawer } = useLayoutStore();
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

  const [infoResponse, currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('gameInfo', () => getGamesInfo(route.params.id as string)),
    useAsyncData('currentLocaleGameContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'game').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleGameContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'game').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const gameContent: Maybe<IGamePage> = currentLocaleData;
  const defaultLocaleGameContent: Maybe<IGamePage> = defaultLocaleData;
  setPageSeo(gameContent?.seo);

  if (infoResponse.status !== 'rejected') {
    gameInfo.value = infoResponse.value.data?.value as IGame;
  }

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
      if ([14100, 14101, 14105].includes(err.data?.error?.code)) {
        const { localizePath } = useProjectMethods();
        await router.push({ path: localizePath('/profile/limits'), query: {} });
        showModal('gameLimitReached');
        return { error: { ...err, fatal: false }}
      }

      if(err.data?.error?.code === 14103) {
        redirectLimitedPlayer();
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

    isDemo.value = !isDemo.value;

    const { data, error } = await startGame();
    if (data) router.replace({ query: { real: `${!isDemo.value}` } });
    else if (error.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  };

  const redirectLimitedPlayer = () :void => {
    const { localizePath } = useProjectMethods();
    router.push(localizePath('/'));
    showAlert(alertsData.value?.limit?.limitedRealGame || defaultLocaleAlertsData.value?.limit?.limitedRealGame);
  };

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

  onBeforeMount(() => {
    compactDrawer(true, false);
  });

  onMounted(async () => {
    document.body.classList.add('is-mob-nav-vertical');
    document.body.classList.add('is-game-page');

    if (!isDemo.value && !isLoggedIn.value) {
      if (gameInfo.value?.isDemoMode) await changeGameMode();
      else showPlug.value = true;
    } else {
      const { error } = await startGame();
      if (error?.fatal) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
    }
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('is-mob-nav-vertical');
    document.body.classList.remove('is-game-page');

    const storageDrawerCompact = localStorage.getItem('IS_DRAWER_COMPACT') === 'true';
    compactDrawer(storageDrawerCompact, false);
  });
</script>

<style src="~/assets/styles/pages/games/game.scss" lang="scss" />

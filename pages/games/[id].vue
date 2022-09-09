<template>
  <box-game
    :frameLink="gameStart"
    :gameInfo="gameInfo"
    @changeMode="changeGameMode"
    :gameContent="gameContent"
  />
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { GameInterface } from '@platform/frontend-core/dist/module';
  import { GamePageInterface } from '~/types';

  const route = useRoute();
  const isDemo = ref<boolean>(route.query.demo === 'true');
  const gameInfo = ref<GameInterface>();
  const gameStart = ref<string>();
  const { getGamesInfo, getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn, playerStatusName } = storeToRefs(profileStore);
  const { showModal, showAlert } = useLayoutStore();
  const { activeAccount } = storeToRefs(walletStore);
  const globalStore = useGlobalStore();
  const { isMobile, alertsData, currentLocale } = storeToRefs(globalStore);
  const infoResponse = await useAsyncData('gameInfo', () => getGamesInfo(route.params.id as string));
  const gameContentRequest = await useAsyncData('gameContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['gamePage']).findOne());
  const gameContent:GamePageInterface|undefined = gameContentRequest.data.value?.gamePage;
  gameInfo.value = infoResponse.data.value;
  const router = useRouter();

  const startGame = async ():Promise<void> => {
    const redirectUrl = window.location.origin + (window.history.state.back || '');
    const startParams = {
      accountId: isDemo.value ? undefined : activeAccount.value.id,
      lobbyUrl: redirectUrl,
      locale: 'en', // currentLocale || browserLanguage,
      countryCode: 'UA',
      demoMode: isDemo.value,
      platform: isMobile.value ? 1 : 2,
    };
    const startResponse = await getStartGame(route.params.id as string, startParams);
    gameStart.value = startResponse.gameUrl;
  };

  const changeGameMode = async ():Promise<void> => {
    if (isDemo.value && !isLoggedIn.value) {
      showModal('register');
      return;
    }

    if (isDemo.value && playerStatusName.value === 'Limited') {
      showAlert(alertsData.value?.limitedRealGame);
      return;
    }

    isDemo.value = !isDemo.value;
    await startGame();
    router.replace({ query: { demo: `${isDemo.value}` } });
  };

  const redirectLimitedPlayer = ():void => {
    if (gameInfo.value.isDemoMode) changeGameMode();
    else {
      const { localizePath } = useProjectMethods();
      router.push(localizePath('/'));
      showAlert(alertsData.value?.limitedRealGame);
    }
  };

  watch(() => isLoggedIn.value, async (newValue:boolean) => {
    if (!newValue) return;

    if (!isDemo.value && playerStatusName.value === 'Limited') {
      setTimeout(() => {
        redirectLimitedPlayer();
      });
    } else {
      await startGame();
    }
  });

  onMounted(async () => {
    document.body.classList.add('is-mob-nav-vertical');
    document.body.classList.add('is-game-page');

    if (!isDemo.value && !isLoggedIn.value) {
      showModal('register');
    } else if (!isDemo.value && playerStatusName.value === 'Limited') {
      redirectLimitedPlayer();
    } else {
      await startGame();
    }
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('is-mob-nav-vertical');
    document.body.classList.remove('is-game-page');
  });
</script>

<style lang="scss" src="./game.scss"/>

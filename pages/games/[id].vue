<template>
  <box-game
    :frameLink="gameStart"
    :gameInfo="gameInfo"
    @changeMode="changeGameMode"
  />
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { GameInterface } from '@platform/frontend-core/dist/module';

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
  const { isMobile } = useGlobalStore();
  const infoResponse = await useAsyncData('gameInfo', () => getGamesInfo(route.params.id as string));
  gameInfo.value = infoResponse.data.value;
  const limitedAlertData = {
    title: 'Error',
    text: 'Sorry, but you can\'t play in real mode for now. Please, contact our support team for more information.',
    variant: 'error',
  };
  const router = useRouter();

  const startGame = async ():Promise<void> => {
    const redirectUrl = window.location.origin + (window.history.state.back || '');
    const startParams = {
      accountId: isDemo.value ? undefined : activeAccount.value.id,
      lobbyUrl: redirectUrl,
      locale: 'en', // currentLocale || browserLanguage,
      countryCode: 'UA',
      demoMode: isDemo.value,
      platform: isMobile ? 1 : 2,
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
      showAlert(limitedAlertData);
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
      showAlert(limitedAlertData);
    }
  };

  watch(() => isLoggedIn.value, async (newValue:boolean) => {
    if (!newValue) return;

    if (!isDemo.value && playerStatusName.value === 'Limited') {
      redirectLimitedPlayer();
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

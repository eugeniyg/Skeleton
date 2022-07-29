<template>
  <box-game :frameLink="gameStart" :gameInfo="gameInfo" @changeMode="changeGameMode"/>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { GameInterface } from '~/CORE';

  const route = useRoute();
  const isDemo = ref<boolean>(route.query.demo === 'true');
  const gameInfo = ref<GameInterface>();
  const gameStart = ref<string>();
  const { getGamesInfo, getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();
  const { activeAccount } = storeToRefs(walletStore);
  const { isMobile } = useGlobalStore();
  const infoResponse = await useAsyncData('gameInfo', () => getGamesInfo(route.params.id as string));
  gameInfo.value = infoResponse.data.value;

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
    const router = useRouter();
    isDemo.value = !isDemo.value;
    await startGame();
    router.replace({ query: { demo: `${isDemo.value}` } });
  };

  watch(() => isLoggedIn.value, async (newValue:boolean) => {
    if (newValue) {
      await startGame();
    }
  });

  onMounted(async () => {
    document.body.classList.add('is-mob-nav-vertical');
    document.body.classList.add('is-game-page');

    walletStore.updateAccounts();

    if (!isDemo.value && !isLoggedIn.value) {
      showModal('register');
    } else {
      await startGame();
    }
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('is-mob-nav-vertical');
    document.body.classList.remove('is-game-page');
    walletStore.stopUpdateAccounts();
  });
</script>

<style lang="scss" src="./game.scss"/>

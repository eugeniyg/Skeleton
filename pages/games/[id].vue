<template>
  <box-game :frameLink="gameStart" :gameInfo="gameInfo" @changeMode="changeGameMode"/>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { gameInfoInterface, gameStartInterface } from '~/types/gameTypes';
  import { useGamesApi } from '~/CORE/index';

  const route = useRoute();
  const isDemo = ref<boolean>(route.query.demo === 'true');
  const gameInfo = ref<gameInfoInterface>();
  const gameStart = ref<gameStartInterface>();
  const { getGamesInfo, getStartGame } = useGamesApi();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { profile, isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();
  const { activeAccount } = storeToRefs(walletStore);
  const { isMobile, currentLocale, browserLanguage } = useGlobalStore();
  const infoResponse = await useAsyncData('gameInfo', () => getGamesInfo(route.params.id));
  gameInfo.value = infoResponse.data.value;

  const startGame = async ():Promise<void> => {
    const redirectUrl = window.location.origin + (window.history.state.back || '');
    const startParams = {
      accountId: activeAccount.value.id,
      lobbyUrl: redirectUrl,
      locale: currentLocale || browserLanguage,
      countryCode: profile.value.country,
      demoMode: isDemo.value,
      platform: isMobile ? 1 : 2,
    };
    const startResponse = await getStartGame(route.params.id, startParams);
    gameStart.value = startResponse.gameUrl;
  };

  const changeGameMode = async ():Promise<void> => {
    const router = useRouter();
    isDemo.value = !isDemo.value;
    await startGame();
    router.push({ query: { demo: `${isDemo.value}` } });
  };

  watch(() => isLoggedIn.value, (newValue:boolean) => {
    if (newValue) {
      startGame();
    }
  });

  onMounted(() => {
    document.body.classList.add('is-mob-nav-vertical');
    document.body.classList.add('is-game-page');

    if (!isLoggedIn.value) {
      showModal('register');
    } else {
      startGame();
    }
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('is-mob-nav-vertical');
    document.body.classList.remove('is-game-page');
  });
</script>

<style lang="scss" src="./game.scss"/>

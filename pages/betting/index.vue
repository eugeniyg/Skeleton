<template>
  <div class="betting">
    <div class="container">
      <iframe
        v-if="frameLink"
        :key="frameLink"
        :src="frameLink"
        height="100%"
        width="100%"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  definePageMeta({
    middleware: ['status-limited'],
  });

  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const frameLink = ref<string>('');

  const { getStartGame } = useCoreGamesApi();

  const startGame = async ():Promise<void> => {
    const redirectUrl = window.location.origin;
    const startParams = {
      accountId: activeAccount.value.id,
      lobbyUrl: redirectUrl,
      locale: 'en',
      countryCode: 'UA',
      demoMode: false,
      platform: isMobile.value ? 1 : 2,
    };
    const startResponse = await getStartGame('betsy-sportsbook-betsy', startParams);
    frameLink.value = startResponse.gameUrl;
  };

  const profileStore = useProfileStore();
  const { isLoggedIn, playerStatusName } = storeToRefs(profileStore);
  const { showModal, showPlayLimitAlert } = useLayoutStore();

  const redirectLimitedPlayer = ():void => {
    const { localizePath } = useProjectMethods();
    const router = useRouter();
    router.replace(localizePath('/'));
    showPlayLimitAlert();
  };

  onMounted(async () => {
    if (isMobile.value) {
      document.querySelector('footer').style.display = 'none';
    }

    if (!isLoggedIn.value) {
      showModal('register');
    } else if (playerStatusName.value === 'Limited') {
      redirectLimitedPlayer();
    } else {
      await startGame();
    }
  });

  watch(() => isLoggedIn.value, async (newValue:boolean) => {
    if (!newValue) return;

    if (playerStatusName.value === 'Limited') {
      setTimeout(() => {
        redirectLimitedPlayer();
      });
    } else {
      await startGame();
    }
  });

  onBeforeUnmount(() => {
    document.querySelector('footer').style.display = null;
  });
</script>

<style lang="scss" src="./style.scss"/>

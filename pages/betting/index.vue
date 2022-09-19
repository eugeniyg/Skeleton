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
    <atomic-seo-text v-if="bettingContent?.seo?.text" v-bind="bettingContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { BettingContentInterface } from '~/types';

  definePageMeta({
    middleware: ['status-limited'],
  });

  const globalStore = useGlobalStore();
  const { isMobile, alertsData, currentLocale } = storeToRefs(globalStore);
  const bettingContentRequest = await useAsyncData('bettingContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['bettingPage']).findOne());
  const bettingContent:BettingContentInterface|undefined = bettingContentRequest.data.value?.bettingPage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(bettingContent?.seo);

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
  const { showModal, showAlert } = useLayoutStore();

  const redirectLimitedPlayer = ():void => {
    const { localizePath } = useProjectMethods();
    const router = useRouter();
    router.replace(localizePath('/'));
    showAlert(alertsData.value?.limitedRealGame);
  };

  onMounted(async () => {
    if (isMobile.value) {
      // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587
      setTimeout(() => {
        document.querySelector('footer').style.display = 'none';
        const seoTextBlock:any = document.querySelector('.text-wrap');
        if (seoTextBlock) seoTextBlock.style.display = 'none';
      }, 100);
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
    if (!newValue) { return; }

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
    const seoTextBlock:any = document.querySelector('.text-wrap');
    if (seoTextBlock) seoTextBlock.style.display = null;
  });
</script>

<style lang="scss" src="./style.scss" />

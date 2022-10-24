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

      <not-auth-game
        v-else-if="showPlug && bettingContent?.plug"
        v-bind="bettingContent.plug"
        singleMode
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

  const showPlug = ref<boolean>(false);
  const globalStore = useGlobalStore();
  const {
    isMobile, alertsData, currentLocale, headerCountry,
  } = storeToRefs(globalStore);
  const bettingContentRequest = await useAsyncData('bettingContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['bettingPage']).findOne());
  const bettingContent:BettingContentInterface|undefined = bettingContentRequest.data.value?.bettingPage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(bettingContent?.seo);

  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const frameLink = ref<string>('');

  const { getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const { isLoggedIn, playerStatusName, profile } = storeToRefs(profileStore);

  const startGame = async ():Promise<void> => {
    const redirectUrl = window.location.origin;
    const startParams = {
      accountId: activeAccount.value.id,
      lobbyUrl: redirectUrl,
      locale: currentLocale.value.code,
      countryCode: profile.value?.country || headerCountry.value || 'UA',
      demoMode: false,
      platform: isMobile.value ? 1 : 2,
    };
    const startResponse = await getStartGame('betsy-sportsbook-betsy', startParams);
    frameLink.value = startResponse.gameUrl;
  };

  const { showAlert } = useLayoutStore();

  const redirectLimitedPlayer = ():void => {
    const { localizePath } = useProjectMethods();
    const router = useRouter();
    router.replace(localizePath('/'));
    showAlert(alertsData.value?.limitedRealGame);
  };

  onMounted(async () => {
    if (isMobile.value) {
      // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587; https://github.com/vuejs/core/issues/5844
      setTimeout(() => {
        document.querySelector('footer').style.display = 'none';
        const seoTextBlock:any = document.querySelector('.text-wrap');
        if (seoTextBlock) seoTextBlock.style.display = 'none';
      }, 300);
    }

    if (!isLoggedIn.value) {
      showPlug.value = true;
    } else if (playerStatusName.value === 'Limited') {
      redirectLimitedPlayer();
    } else {
      await startGame();
    }
  });

  watch(() => isLoggedIn.value, async (newValue:boolean) => {
    if (!newValue) { return; }

    showPlug.value = false;
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

<style lang="scss">
.betting {
  display: grid;
  grid-template-areas:
    "container nav"
    "panel nav"
    "seo nav";
  align-items: var(--align-items, flex-end);
  grid-template-columns: 1fr auto;
  margin: -24px -16px 0 -16px;

  @include media(sm) {
    margin-right: -2rem;
    margin-left: -2rem;
  }

  @include media(l) {
    width: 100%;
    margin: 0;
  }

  .container {
    background-color: var(--black-primary);
    grid-area: container;
    position: relative;
    width: 100%;
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    height: calc(var(--vh, 1vh) * 100 - 120px - var(--safe-area-inset-bottom));

    @include media(l) {
      height: calc(100vh - 88px);
    }

    iframe {
      display: block;
      max-width: 100%;
      border: none !important;
    }
  }

  .text-wrap {
    grid-area: seo;
  }
}
</style>

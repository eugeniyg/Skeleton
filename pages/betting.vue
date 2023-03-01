<template>
  <div class="betting">
    <div id="betting-container" class="container">
      <not-auth-game
        v-if="showPlug && bettingContent?.plug"
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
  const bettingContentRequest = await useAsyncData('bettingContent', () => queryContent(`page-controls/${currentLocale.value?.code}`).only(['bettingPage']).findOne());
  const bettingContent:Maybe<BettingContentInterface> = bettingContentRequest.data.value?.bettingPage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(bettingContent?.seo);

  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);

  const { getStartGame } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);

  const sdkDefaultParams = {
    containerId: 'betting-container',
    width: '100%',
    height: '100%',
    parent: false,
  };

  const { betsyParams } = useGamesStore();

  const startGame = async ():Promise<void> => {
    const redirectUrl = window.location.origin;
    const startParams = {
      accountId: activeAccount.value?.id,
      lobbyUrl: redirectUrl,
      locale: currentLocale.value?.code || 'en',
      countryCode: profile.value?.country || headerCountry.value || 'UA',
      demoMode: false,
      platform: isMobile.value ? 1 : 2,
    };
    const startResponse = await getStartGame('betsy-sportsbook-betsy', startParams);
    const params = {
      ...sdkDefaultParams,
      ...betsyParams,
      token: startResponse.token,
      lang: currentLocale.value?.code || 'en',
      theme: 'turbo_slotsbet',
    };

    if (window.BetSdk) window.BetSdk.init(params);
  };

  const layoutStore = useLayoutStore();
  const { showAlert, compactDrawer } = layoutStore;

  const redirectLimitedPlayer = ():void => {
    const { localizePath } = useProjectMethods();
    const router = useRouter();
    router.replace(localizePath('/'));
    showAlert(alertsData.value?.limitedRealGame);
  };

  watch(() => activeAccount.value?.id, async (oldValue, newValue) => {
    if (oldValue && newValue && oldValue !== newValue) await startGame();
  });

  onBeforeMount(() => {
    compactDrawer(true, false);
  });

  onMounted(async () => {
    if (isMobile.value) {
      const footerEl:HTMLElement|null = document.querySelector('footer');
      if (footerEl) footerEl.style.display = 'none';
      const seoTextBlock:HTMLElement|null = document.querySelector('.text-wrap');
      if (seoTextBlock) seoTextBlock.style.display = 'none';
    }

    if (!isLoggedIn.value) {
      showPlug.value = true;
    } else if (profile.value?.status === 2) {
      redirectLimitedPlayer();
    } else {
      await startGame();
    }
  });

  watch(() => isLoggedIn.value, async (newValue:boolean) => {
    if (!newValue) { return; }

    showPlug.value = false;
    if (profile.value?.status === 2) {
      setTimeout(() => {
        redirectLimitedPlayer();
      });
    } else {
      await startGame();
    }
  });

  onBeforeUnmount(() => {
    const footerEl:any = document.querySelector('footer');
    if (footerEl) footerEl.style.display = null;
    const seoTextBlock:any = document.querySelector('.text-wrap');
    if (seoTextBlock) seoTextBlock.style.display = null;

    const storageDrawerCompact = localStorage.getItem('IS_DRAWER_COMPACT') === 'true';
    compactDrawer(storageDrawerCompact, false);
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
  margin: rem(-24px) rem(-16px) 0 rem(-16px);

  @include media(sm) {
    margin-right: rem(-32px);
    margin-left: rem(-32px);
  }

  @include media(md) {
    margin-top: 0;
    margin-left: rem(-10px);
    margin-right: rem(-10px);
  }

  .container {
    background-color: var(--black-primary);
    grid-area: container;
    position: relative;
    width: 100%;
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    height: calc(var(--vh-static, 1vh) * 100 - 120px - var(--safe-area-inset-bottom));

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

<template>
  <div class="betting">
    <div id="betting-container" class="container">
      <not-auth-game
        v-if="showPlug && (bettingContent?.plug || defaultLocaleBettingContent?.plug)"
        v-bind="bettingContent?.plug || defaultLocaleBettingContent?.plug"
        singleMode
      />
    </div>

    <atomic-seo-text v-if="bettingContent?.seo?.text" v-bind="bettingContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { BettingContentInterface } from '@skeleton/types';

  definePageMeta({
    middleware: ['status-limited'],
  });

  const showPlug = ref<boolean>(false);
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
  const bettingContentRequest = await useAsyncData('bettingContent', () => queryContent('page-controls')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'bettingPage']).find());
  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(bettingContentRequest.data.value);
  const bettingContent: Maybe<BettingContentInterface> = currentLocaleData?.bettingPage;
  const defaultLocaleBettingContent: Maybe<BettingContentInterface> = defaultLocaleData?.bettingPage;
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

  const startGame = async ():Promise<void> => {
    const runtimeConfig = useRuntimeConfig();
    const mainHost = window.location.origin;
    const startParams = {
      accountId: activeAccount.value?.id,
      lobbyUrl: mainHost,
      locale: currentLocale.value?.code || 'en',
      countryCode: profile.value?.country || headerCountry.value || 'UA',
      demoMode: false,
      platform: isMobile.value ? 1 : 2,
    };
    const startResponse = await getStartGame('betsy-sportsbook-betsy', startParams);
    const params = {
      ...sdkDefaultParams,
      host: runtimeConfig.public.betsyParams?.clientHost,
      cid: runtimeConfig.public.betsyParams?.clientId,
      theme: runtimeConfig.public.betsyParams?.sportsBookTheme,
      customStyles: runtimeConfig.public.betsyParams?.sportsBookStyles ? `${mainHost}${runtimeConfig.public.betsyParams.sportsBookStyles}` : undefined,
      token: startResponse.token,
      lang: currentLocale.value?.code || 'en',
    };

    if (window.BetSdk) window.BetSdk.init(params);
  };

  const layoutStore = useLayoutStore();
  const { showAlert, compactDrawer } = layoutStore;

  const redirectLimitedPlayer = ():void => {
    const { localizePath } = useProjectMethods();
    const router = useRouter();
    router.replace(localizePath('/'));
    showAlert(alertsData.value?.limitedRealGame || defaultLocaleAlertsData.value?.limitedRealGame);
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

<style src="~/assets/styles/pages/betting.scss" lang="scss" />


export default defineNuxtPlugin(async (nuxtApp) => {
  const { parseUserAgent } = useGlobalStore();
  const { userAgent } = window.navigator;
  parseUserAgent(userAgent);

  nuxtApp.hook('page:finish', () => {
    const { preloaderDone } = useProjectMethods();
    preloaderDone();
  });

  const checkAffiliateTag = ():void => {
    const historyBack = window.history.state.back;
    const profileStore = useProfileStore();
    const route = useRoute();

    if (profileStore.isLoggedIn) {
      localStorage.removeItem('affiliateTag');
    } else if (route.query?.stag) {
      localStorage.setItem('affiliateTag', route.query.stag as string);
    } else if (!historyBack) {
      localStorage.removeItem('affiliateTag');
    }
  };

  nuxtApp.hook('app:mounted', async () => {
    const { initWebSocket } = useWebSocket();
    await initWebSocket();
    const { getSessionToken } = useProfileStore();
    const sessionToken = getSessionToken();

    if (sessionToken) {
      const { startProfileDependencies } = useProfileStore();
      startProfileDependencies();
    }

    const { subscribeWinnersSocket } = useGamesStore();
    subscribeWinnersSocket();
    checkAffiliateTag();
  });

  const setWindowStaticHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh-static', `${vh}px`);
  };

  const setWindowHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setWindowStaticHeight();
  setWindowHeight();
  window.addEventListener('resize', setWindowHeight);
});

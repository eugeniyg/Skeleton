export default defineNuxtPlugin((nuxtApp) => {
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

  const setWindowStaticHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh-static', `${vh}px`);
  };

  const setWindowHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  nuxtApp.hook('app:mounted', async () => {
    const { parseUserAgent } = useGlobalStore();
    const { userAgent } = window.navigator;
    parseUserAgent(userAgent);

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

    setWindowStaticHeight();
    setWindowHeight();
    window.addEventListener('resize', setWindowHeight);

    const { public: { freshchatForGuest }} = useRuntimeConfig();
    const { addFreshChatScript, initChat } = useFreshchatStore();
    if (freshchatForGuest) initChat();
    else if (sessionToken) addFreshChatScript();
  });

  nuxtApp.hook('page:finish', () => {
    const { name, query } = useRoute();
    const isAuthAutologin = (name as string).includes('auth-autologin') && !!query.state;
    if (isAuthAutologin) return;

    const { preloaderDone } = useProjectMethods();
    preloaderDone();
  });
});

export default defineNuxtPlugin(async (nuxtApp) => {
  const { parseUserAgent } = useGlobalStore();
  // const languages = parser.parse(nuxtApp.ssrContext.req.headers['accept-language']);
  // setBrowserLanguage(languages);
  const { userAgent } = window.navigator;
  parseUserAgent(userAgent);

  nuxtApp.hook('page:finish', () => {
    const route = useRoute();
    const { preloaderDone } = useProjectMethods();
    if (route.name !== 'main' && route.name !== 'locale-main') preloaderDone();
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
    const bearer = useCookie('bearer');

    if (bearer.value) {
      const { subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      subscribeAccountSocket();
      subscribeInvoicesSocket();
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

export default defineNuxtPlugin(async (nuxtApp) => {
  const { parseUserAgent } = useGlobalStore();
  // const languages = parser.parse(nuxtApp.ssrContext.req.headers['accept-language']);
  // setBrowserLanguage(languages);
  const { userAgent } = window.navigator;
  parseUserAgent(userAgent);

  const profileStore = useProfileStore();
  const { getUserAccounts } = useWalletStore();
  const { getFavoriteGames } = useGamesStore();
  const route = useRoute();
  const bearer = useCookie('bearer');

  if (bearer.value) {
    try {
      await Promise.all([
        profileStore.getProfileData(),
        getUserAccounts(),
      ]);
      getFavoriteGames();
    } catch (error) {
      if (error.response?.status === 401) {
        profileStore.logOutUser(false);
      } else {
        throw error;
      }
    }
  }

  nuxtApp.hook('page:finish', () => {
    const { preloaderDone } = useProjectMethods();
    if (route.name !== 'main' && route.name !== 'locale-main') preloaderDone();
  });

  const checkAffiliateTag = ():void => {
    const historyBack = window.history.state.back;

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

    if (bearer.value) {
      const { subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      subscribeAccountSocket();
      subscribeInvoicesSocket();
    }
    const { subscribeWinnersSocket } = useGamesStore();
    subscribeWinnersSocket();
    checkAffiliateTag();
  });

  const setWindowHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setWindowHeight();
});

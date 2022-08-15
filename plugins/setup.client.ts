export default defineNuxtPlugin(async (nuxtApp) => {
  const { parseUserAgent } = useGlobalStore();
  // const languages = parser.parse(nuxtApp.ssrContext.req.headers['accept-language']);
  // setBrowserLanguage(languages);
  const { userAgent } = window.navigator;
  parseUserAgent(userAgent);

  const profileStore = useProfileStore();
  const { getUserAccounts } = useWalletStore();
  const { getFavoriteGames } = useGamesStore();
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
        profileStore.logOutUser();
      } else {
        throw error;
      }
    }
  }

  nuxtApp.hook('page:finish', () => {
    const route = useRoute();
    const { preloaderDone } = useProjectMethods();
    if (route.name !== 'main' && route.name !== 'locale-main') preloaderDone();
  });

  nuxtApp.hook('app:mounted', async () => {
    const { initWebSocket } = useWebSocket();
    await initWebSocket();

    if (bearer.value) {
      const { createSubscription } = useWebSocket();
      const { updateAccount } = useWalletStore();
      createSubscription(`wallet:accounts#${profileStore.profile.id}`, updateAccount);
    }
  });

  const setWindowHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setWindowHeight();
});

export default defineNuxtPlugin((nuxtApp) => {
  const checkAffiliateTag = ():void => {
    const historyBack = window.history.state.back;
    const { isLoggedIn } = useProfileStore();
    const route = useRoute();

    if (isLoggedIn) {
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

  const startWebSocket = async (): Promise<void> => {
    const { initWebSocket } = useWebSocket();
    await initWebSocket();
    const { subscribeWinnersSocket } = useGamesStore();
    subscribeWinnersSocket();
  }

  const startProfileLogic = (): void => {
    const { getSessionToken } = useProfileStore();
    const sessionToken = getSessionToken();

    if (sessionToken) {
      const { startProfileDependencies } = useProfileStore();
      startProfileDependencies();
    }
  }

  const startFreshchatLogic = (): void => {
    const { public: { freshchatParams } } = useRuntimeConfig();
    const { addFreshChatScript, initChat } = useFreshchatStore();
    const { getSessionToken } = useProfileStore();
    const sessionToken = getSessionToken();

    if (freshchatParams?.guestAvailable) initChat();
    else if (sessionToken) addFreshChatScript();
  }

  const decodeBase64 = (value: string): string|undefined => {
    try {
      return window.atob(value);
    } catch {
      return undefined
    }
  }

  const listeningChangeSession = async (event: StorageEvent): Promise<void> => {
    if (event.key !== 'changeSession' || !event.newValue) return;

    const decodeValue = decodeBase64(event.newValue);
    if (!decodeValue) return;

    const changeType = decodeValue.split('-')[1];
    const { isLoggedIn } = useProfileStore();
    const loginParallel = !isLoggedIn && changeType === 'login';
    const logoutParallel = isLoggedIn && changeType === 'logout';

    if (loginParallel) {
      const router = useRouter();
      router.go(0);
    } else if (logoutParallel) {
      const { localizePath } = useProjectMethods();
      window.location.href = window.location.origin + localizePath('/');
    }
  }

  nuxtApp.hook('app:created', async () => {
    const { getProviderList, getCollectionsList } = useGamesStore();
    getProviderList();
    getCollectionsList();
  });

  nuxtApp.hook('app:mounted', async () => {
    const { parseUserAgent } = useGlobalStore();
    const { userAgent } = window.navigator;
    parseUserAgent(userAgent);
    window.addEventListener('storage', listeningChangeSession);

    await startWebSocket();
    startProfileLogic();

    checkAffiliateTag();
    setWindowStaticHeight();
    setWindowHeight();
    window.addEventListener('resize', setWindowHeight);
    startFreshchatLogic();
  });

  nuxtApp.hook('page:finish', () => {
    const { name, query } = useRoute();
    const isAuthAutologin = (name as string).includes('auth-autologin') && !!query.state;
    if (isAuthAutologin) return;

    const { preloaderDone } = useProjectMethods();
    preloaderDone();
  });
});

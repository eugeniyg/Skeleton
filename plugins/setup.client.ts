import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default defineNuxtPlugin((nuxtApp) => {
  const checkAffiliateTag = ():void => {
    const route = useRoute();
    const router = useRouter();
    const runtimeConfig = useRuntimeConfig();
    const cookieAffiliateTag = useCookie('affiliateTag');

    if (route.query?.stag && !cookieAffiliateTag.value) {
      const cookieAffiliateTag = useCookie('affiliateTag', { maxAge: 60 * 60 * 24 * (runtimeConfig.public.affiliateTagExpiration as number || 30) });
      cookieAffiliateTag.value = route.query.stag as string;
    }

    if (route.query?.stag) router.replace({query: { ...route.query, stag: undefined } });
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

  const getFingerprintVisitor = async ():Promise<string> => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  }

  nuxtApp.hook('app:created', async () => {
    const { getProviderList, getCollectionsList } = useGamesStore();
    getProviderList();
    getCollectionsList();

    const profileStore = useProfileStore();
    profileStore.fingerprintVisitor = getFingerprintVisitor();
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
    const route = useRoute();
    const autologinRoute = route.name === 'auth-autologin' || route.name === 'locale-auth-autologin';
    const callbackRoute = route.name === 'auth-callback' || route.name === 'locale-auth-callback';
    const isAuthAutologin = autologinRoute && !!route.query.state;
    const isAuthCallback = callbackRoute && !!route.query.code && !!route.query.state;

    if (isAuthAutologin || isAuthCallback) return;

    const { preloaderDone } = useProjectMethods();
    preloaderDone();
  });
});

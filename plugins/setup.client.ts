import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { isStandalonePWA } from 'ua-parser-js/helpers';

export default defineNuxtPlugin(nuxtApp => {
  const checkAffiliateTag = (): void => {
    const route = useRoute();
    const router = useRouter();
    const runtimeConfig = useRuntimeConfig();
    const cookieAffiliateTag = useCookie('affiliateTag');

    if (route.query?.stag && !cookieAffiliateTag.value) {
      const cookieAffiliateTag = useCookie('affiliateTag', {
        maxAge: 60 * 60 * 24 * ((runtimeConfig.public.affiliateTagExpiration as number) || 30),
      });
      cookieAffiliateTag.value = route.query.stag as string;
    }

    if (route.query?.stag) router.replace({ query: { ...route.query, stag: undefined } });
  };

  const checkPwaApp = (): void => {
    const profileStore = useProfileStore();
    const isStandalone = isStandalonePWA();

    if (!isStandalone) {
      window.matchMedia('(display-mode: standalone)').addEventListener('change', (event: any) => {
        if (event.target.matches && !profileStore.isPwaStandalone) {
          profileStore.checkPwaDetect();
        }
      });
    }
  };

  // const checkPwaApp = (): void => {
  //   const profileStore = useProfileStore();
  //
  //   profileStore.isPwaStandalone =
  //     // @ts-expect-error: Non-standard properties
  //     window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  //
  //   if (!profileStore.isPwaStandalone) {
  //     window.matchMedia('(display-mode: standalone)').addEventListener('change', (event: any) => {
  //       if (event.target.matches && !profileStore.isPwaStandalone) {
  //         profileStore.isPwaStandalone = true;
  //         profileStore.checkPwaDetect();
  //       }
  //     });
  //   }
  // };

  const setWindowStaticHeight = (): void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh-static', `${vh}px`);
  };

  const setWindowHeight = (): void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  const startProfileLogic = (): void => {
    const { getSessionToken, checkPwaDetect } = useProfileStore();
    const sessionToken = getSessionToken();

    if (sessionToken) {
      const { startProfileDependencies } = useProfileStore();
      startProfileDependencies();
      checkPwaDetect();
    }
  };

  const startFreshchatLogic = (): void => {
    const {
      public: { freshchatParams },
    } = useRuntimeConfig();
    const { addFreshChatScript, initChat } = useFreshchatStore();
    const { getSessionToken } = useProfileStore();
    const sessionToken = getSessionToken();

    if (freshchatParams?.guestAvailable) initChat();
    else if (sessionToken) addFreshChatScript();
  };

  const decodeBase64 = (value: string): string | undefined => {
    try {
      return window.atob(value);
    } catch {
      return undefined;
    }
  };

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
  };

  const getFingerprintVisitor = async (): Promise<string> => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  const checkTabVisibility = (): void => {
    const { isMobile } = useGlobalStore();
    const { isLoggedIn } = useProfileStore();
    if (isMobile && isLoggedIn && document.visibilityState === 'visible') {
      const { getUserAccounts } = useWalletStore();
      getUserAccounts();
    }
  };

  nuxtApp.hook('app:created', async () => {
    const { getProviderList, getCollectionsList } = useGamesStore();
    const { getRegistrationFields } = useFieldsStore();
    getProviderList();
    getCollectionsList();
    getRegistrationFields();

    const profileStore = useProfileStore();
    profileStore.fingerprintVisitor = getFingerprintVisitor();
  });

  nuxtApp.hook('app:mounted', async () => {
    const { parseUserAgent } = useGlobalStore();
    const { userAgent } = window.navigator;
    parseUserAgent(userAgent);
    window.addEventListener('storage', listeningChangeSession);
    const { initWebSocket } = useWebSocket();
    await initWebSocket();
    checkPwaApp();
    startProfileLogic();

    checkAffiliateTag();
    setWindowStaticHeight();
    setWindowHeight();
    window.addEventListener('resize', setWindowHeight);
    startFreshchatLogic();
    window.addEventListener('visibilitychange', checkTabVisibility);
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

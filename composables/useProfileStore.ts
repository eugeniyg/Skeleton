import { defineStore } from 'pinia';
import type {
  IProfile,
  IAuthorizationResponse,
  IParsedToken
} from '@skeleton/core/types';
import { jwtDecode } from "jwt-decode";

interface IProfileStoreState {
  refreshPromise: Promise<string>|null;
  currentSessionToken: Maybe<string>;
  isLoggedIn: boolean;
  sessionId: string;
  resentVerifyEmail: boolean;
  profile: Maybe<IProfile>;
  tokenCookieKey: string;
}

export const useProfileStore = defineStore('profileStore', {
  state: (): IProfileStoreState => ({
    refreshPromise: null,
    currentSessionToken: null,
    isLoggedIn: false,
    sessionId: '',
    resentVerifyEmail: false,
    profile: undefined,
    tokenCookieKey: 'access_token'
  }),

  getters: {
    userNickname(state):string {
      return state.profile?.nickname || 'Unknown';
    },
  },

  actions: {
    setSessionToken (tokenValue:string):void {
      if (this.currentSessionToken === tokenValue) return;
      const cookieToken = useCookie(this.tokenCookieKey, { maxAge: 60 * 60 * 24 * 30 });
      cookieToken.value = tokenValue;
      this.currentSessionToken = tokenValue;
    },

    getSessionToken ():Maybe<string> {
      if (this.currentSessionToken) return this.currentSessionToken;
      const cookieToken = useCookie(this.tokenCookieKey);
      this.currentSessionToken = cookieToken.value;
      return this.currentSessionToken;
    },

    isTokenExpired ():boolean {
      const token = this.getSessionToken();
      if (!token) return false;

      const currentSession:IParsedToken = jwtDecode(token);
      return currentSession.exp ? currentSession.exp <= Date.now() / 1000 : false;
    },

    getCurrentSession ():IParsedToken|null {
      const token = this.getSessionToken();
      if (token) {
        return jwtDecode(token);
      }
      return null;
    },

    removeSession ():void {
      this.profile = undefined;
      const cookieToken = useCookie(this.tokenCookieKey);
      cookieToken.value = null;
      this.currentSessionToken = null;
    },

    async getRefreshRequest (options:any): Promise<string> {
      const { refreshToken } = useCoreAuthApi();

      try {
        const data = await refreshToken(options);
        this.setSessionToken(data.accessToken);
        return data.accessToken;
      } finally {
        this.refreshPromise = null;
      }
    },

    refreshToken(options:any): string|Promise<string> {
      if (this.refreshPromise) return this.refreshPromise;
      this.refreshPromise = this.getRefreshRequest(options);
      return this.refreshPromise;
    },

    startSession(authData: IAuthorizationResponse):void {
      this.profile = authData.profile;
      const { reconnectSocket } = useWebSocket();
      reconnectSocket();
    },

    startProfileDependencies():void {
      const { getFavoriteGames } = useGamesStore();
      const {
        getPlayerBonuses,
        getDepositBonusCode,
        getPlayerFreeSpins,
        getPlayerCashback
      } = useBonusStore();
      getFavoriteGames();
      getDepositBonusCode();

      const { activeAccount } = useWalletStore();
      getPlayerCashback(activeAccount?.currency);

      const route = useRoute();
      const routeName = route.name as string;
      if (!routeName.includes('profile-bonuses')) {
        getPlayerBonuses();
        getPlayerFreeSpins();
      }

      const { subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      const { subscribeBonusCodeSocket, subscribeBonusSocket, subscribeFreeSpinsSocket } = useBonusStore();
      subscribeAccountSocket();
      subscribeInvoicesSocket();
      subscribeBonusCodeSocket();
      subscribeBonusSocket();
      subscribeFreeSpinsSocket();

      const { setEquivalentCurrency } = useGlobalStore();
      const storageEquivalentCurrency = localStorage.getItem('equivalentCurrency');
      if (storageEquivalentCurrency) setEquivalentCurrency(storageEquivalentCurrency);
    },

    finishProfileDependencies():void {
      const bonusStore = useBonusStore();
      bonusStore.$reset();

      const { unsubscribeAccountSocket, unsubscribeInvoiceSocket } = useWalletStore();
      const { unsubscribeBonusCodeSocket, unsubscribeBonusSocket, unsubscribeFreeSpinsSocket } = useBonusStore();
      unsubscribeAccountSocket();
      unsubscribeInvoiceSocket();
      unsubscribeBonusCodeSocket();
      unsubscribeBonusSocket();
      unsubscribeFreeSpinsSocket();
    },

    async handleLogin(authResponse: IAuthorizationResponse):Promise<void> {
      this.setSessionToken(authResponse.accessToken);
      this.startSession(authResponse);
      await nextTick();

      const { getUserAccounts } = useWalletStore();
      await getUserAccounts();

      this.isLoggedIn = true;

      const { public: { freshchatParams }} = useRuntimeConfig();
      const { updateChat, addFreshChatScript } = useFreshchatStore();
      if (freshchatParams?.guestAvailable) updateChat();
      else addFreshChatScript();

      this.startProfileDependencies();
    },

    async logIn(loginData:any):Promise<void> {
      const { submitLoginData } = useCoreAuthApi();
      const submitResult = await submitLoginData(loginData);
      await this.handleLogin(submitResult);
    },

    async autoLogin(token: string):Promise<void> {
      const { submitAutologinData } = useCoreAuthApi();
      const submitResult = await submitAutologinData(token);
      await this.handleLogin(submitResult);
    },

    async registration(registrationData:any):Promise<void> {
      const { submitRegistrationData } = useCoreAuthApi();
      const submitResult = await submitRegistrationData(registrationData);
      await this.handleLogin(submitResult);

      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      showAlert(alertsData?.profile?.successRegistration || defaultLocaleAlertsData?.profile?.successRegistration);
    },

    async getProfileData():Promise<void> {
      const { getProfile } = useCoreProfileApi();
      const profileInfo = await getProfile();
      this.profile = profileInfo;
      this.isLoggedIn = true;
    },

    setProfileData(data: IProfile):void {
      this.profile = data;
    },

    async logOutUser():Promise<void> {
      const { logOut } = useCoreAuthApi();
      try {
        await logOut();
      } finally {
        this.isLoggedIn = false;
        this.removeSession();
        const { updateChat } = useFreshchatStore();
        updateChat();
        this.finishProfileDependencies();

        const { deleteReturnGame } = useLayoutStore();
        deleteReturnGame();

        sessionStorage.removeItem('depositBonusData');
        const router = useRouter();
        const { localizePath } = useProjectMethods();
        router.push(localizePath('/'));
      }
    },

    async resendVerifyEmail():Promise<void> {
      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      const { resendVerifyEmail } = useCoreProfileApi();
      try {
        await resendVerifyEmail();
        showAlert(alertsData?.profile?.resentVerification || defaultLocaleAlertsData?.profile?.resentVerification);
      } catch {
        showAlert(alertsData?.global?.somethingWrong || defaultLocaleAlertsData?.global?.somethingWrong);
      } finally {
        this.resentVerifyEmail = true;
      }
    },
  },
});

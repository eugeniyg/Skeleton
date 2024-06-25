import { defineStore } from 'pinia';
import type {
  IProfile,
  IAuthorizationResponse,
  IParsedToken,
  IAuthState
} from '@skeleton/core/types';
import { jwtDecode } from "jwt-decode";

interface IProfileStoreState {
  refreshPromise: Promise<string>|null;
  isLoggedIn: boolean;
  sessionId: string;
  resentVerifyEmail: boolean;
  profile: Maybe<IProfile>;
  socialAuthEmailError: boolean;
  tokenCookieKey: string;
}

export const useProfileStore = defineStore('profileStore', {
  state: (): IProfileStoreState => ({
    refreshPromise: null,
    isLoggedIn: false,
    sessionId: '',
    resentVerifyEmail: false,
    profile: undefined,
    socialAuthEmailError: false,
    tokenCookieKey: 'access_token'
  }),

  getters: {
    userNickname(state):string {
      return state.profile?.nickname || 'Unknown';
    },
  },

  actions: {
    setSessionToken (tokenValue:string):void {
      const cookieToken = useCookie(this.tokenCookieKey, { maxAge: 60 * 60 * 24 * 365 });
      cookieToken.value = tokenValue;
    },

    getSessionToken ():Maybe<string> {
      const cookieToken = useCookie(this.tokenCookieKey);
      return cookieToken.value;
    },

    isTokenExpired ():boolean {
      const token = this.getSessionToken();
      if (!token) return false;

      const currentSession:IParsedToken = jwtDecode(token);
      return currentSession.exp ? (currentSession.exp - 10) < (Date.now() / 1000) : false;
    },

    getCurrentSession ():IParsedToken|null {
      const token = this.getSessionToken();
      if (token) {
        return jwtDecode(token);
      }
      return null;
    },

    encodeSessionChange (key: 'login'|'logout'): string {
      const time = Date.now();
      return window.btoa(`${time}-${key}`);
    },

    removeSession ():void {
      this.profile = undefined;
      const cookieToken = useCookie(this.tokenCookieKey);
      cookieToken.value = null;
      this.isLoggedIn = false;
      localStorage.setItem('changeSession', this.encodeSessionChange('logout'));

      const { updateChat } = useFreshchatStore();
      updateChat();

      this.finishProfileDependencies();

      const { deleteReturnGame } = useLayoutStore();
      deleteReturnGame();
      },

    async getRefreshRequest (): Promise<string> {
      const { refreshToken } = useCoreAuthApi();

      try {
        const data = await refreshToken();
        this.setSessionToken(data.accessToken);
        return data.accessToken;
      } catch (err:any) {
        if ([403, 401].includes(err.response?.status)) {
          this.removeSession();
          return '';
        }
        throw err;
      } finally {
        this.refreshPromise = null;
      }
    },

    refreshToken(): string|Promise<string> {
      if (this.refreshPromise) return this.refreshPromise;
      this.refreshPromise = this.getRefreshRequest();
      return this.refreshPromise;
    },

    startSession(authData: IAuthorizationResponse):void {
      this.profile = authData.profile;
      const { reconnectSocket } = useWebSocket();
      reconnectSocket();
    },

    startProfileDependencies():void {
      const { getFavoriteGames, subscribeBetsSocket } = useGamesStore();
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
      subscribeBetsSocket();

      const { setEquivalentCurrency } = useGlobalStore();
      const storageEquivalentCurrency = localStorage.getItem('equivalentCurrency');
      if (storageEquivalentCurrency) setEquivalentCurrency(storageEquivalentCurrency);
    },

    finishProfileDependencies():void {
      const bonusStore = useBonusStore();
      bonusStore.$reset();

      const { unsubscribeAccountSocket, unsubscribeInvoiceSocket } = useWalletStore();
      const { unsubscribeBonusCodeSocket, unsubscribeBonusSocket, unsubscribeFreeSpinsSocket } = useBonusStore();
      const { unsubscribeBetsSocket } = useGamesStore();
      unsubscribeAccountSocket();
      unsubscribeInvoiceSocket();
      unsubscribeBonusCodeSocket();
      unsubscribeBonusSocket();
      unsubscribeFreeSpinsSocket();
      unsubscribeBetsSocket();
    },

    async handleLogin(authResponse: IAuthorizationResponse):Promise<void> {
      this.setSessionToken(authResponse.accessToken);
      this.startSession(authResponse);
      await nextTick();

      const { getUserAccounts } = useWalletStore();
      await getUserAccounts();

      this.isLoggedIn = true;
      localStorage.setItem('changeSession', this.encodeSessionChange('login'));

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

    registrationSucceeded():void {
      const { showAlert, closeModal, openWalletModal } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();

      localStorage.removeItem('affiliateTag');
      showAlert(alertsData?.profile?.successRegistration || defaultLocaleAlertsData?.profile?.successRegistration);
      closeModal('register');
      openWalletModal();
    },

    async loginSocial(socialData:any, authState?: IAuthState):Promise<void> {
      const { submitSocialLoginData } = useCoreAuthApi();
      const submitResult = await submitSocialLoginData(socialData);
      await this.handleLogin(submitResult);

      const router = useRouter();
      const { localizePath } = useProjectMethods();
      await router.replace(authState?.targetUrl || localizePath('/'));

      if (submitResult.profile?.isNewlyRegistered) {
        useEvent('analyticsEvent', {
          event: 'registrationSuccess',
          regType: 'social'
        });
        this.registrationSucceeded();
      }
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
      useEvent('analyticsEvent', {
        event: 'registrationSuccess',
        regType: 'email'
      });
      this.registrationSucceeded();
    },

    async phoneRegistration(registrationData:any):Promise<void> {
      const { registerByPhone } = useCoreAuthApi();
      const submitResult = await registerByPhone(registrationData);
      await this.handleLogin(submitResult);
      useEvent('analyticsEvent', {
        event: 'registrationSuccess',
        regType: 'phone'
      });
      this.registrationSucceeded();
    },

    async getProfileData():Promise<void> {
      const { getProfile } = useCoreProfileApi();
      this.profile = await getProfile();
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
        this.removeSession();

        const router = useRouter();
        const { localizePath } = useProjectMethods();
        await router.push(localizePath('/'));
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

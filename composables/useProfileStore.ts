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
  onlineSubscription: any;
  fingerprintVisitor: Promise<string>|null;
}

export const useProfileStore = defineStore('profileStore', {
  state: (): IProfileStoreState => ({
    refreshPromise: null,
    isLoggedIn: false,
    sessionId: '',
    resentVerifyEmail: false,
    profile: undefined,
    socialAuthEmailError: false,
    tokenCookieKey: 'access_token',
    onlineSubscription: undefined,
    fingerprintVisitor: null
  }),

  getters: {
    userNickname(state):string {
      if (state.profile?.nickname) return state.profile.nickname;
      if (state.profile?.email) {
        const { getNicknameFromEmail } = useProjectMethods();
        return getNicknameFromEmail(state.profile.email);
      }
      return 'Unknown';
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
      sessionStorage.removeItem('asyncInvoiceId');
      localStorage.setItem('changeSession', this.encodeSessionChange('logout'));

      const { updateChat } = useFreshchatStore();
      updateChat();

      this.finishProfileDependencies();

      const { deleteReturnGame } = useLayoutStore();
      deleteReturnGame();
    },

    async getRefreshRequest (): Promise<string> {
      const storageRefreshStatus = localStorage.getItem('refreshSession');

      if (storageRefreshStatus === 'loading') {
        const { awaitRefreshParallel } = useProjectMethods();
        const newToken = await awaitRefreshParallel();
        if (newToken) {
          this.setSessionToken(newToken);
          return newToken;
        } else {
          this.removeSession();
          return '';
        }
      }

      localStorage.setItem('refreshSession', 'loading');
      const { refreshToken } = useCoreAuthApi();

      try {
        const data = await refreshToken();
        this.setSessionToken(data.accessToken);
        localStorage.setItem('refreshSession', data.accessToken);
        return data.accessToken;
      } catch {
        this.removeSession();
        localStorage.removeItem('refreshSession');
        return '';
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
        getPlayerFreeSpins,
        getPlayerCashback,
        getDepositBonuses
      } = useBonusStore();
      const { getPlayerActiveQuests, subscribeQuestsSocket } = useQuestsStore();
      const { getPlayerLoyalty, subscribeLoyaltySocket } = useLoyaltyStore();
      const { getPopoverNotifications, subscribeNotificationSocket } = useNotificationStore();
      const runtimeConfig = useRuntimeConfig();
      getFavoriteGames();
      if (runtimeConfig.public?.questsEnabled) getPlayerActiveQuests();
      if (runtimeConfig.public?.loyaltyEnabled) getPlayerLoyalty();
      getPopoverNotifications();
      getPlayerCashback();

      const route = useRoute();
      const bonusesRoute = route.name === 'profile-bonuses' || route.name === 'locale-profile-bonuses';
      if (!bonusesRoute) {
        getPlayerBonuses();
        getPlayerFreeSpins();
        getDepositBonuses();
      }

      const { subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      const { subscribeBonusCodeSocket, subscribeBonusSocket, subscribeFreeSpinsSocket } = useBonusStore();

      subscribeAccountSocket();
      subscribeInvoicesSocket();
      subscribeBonusCodeSocket();
      subscribeBonusSocket();
      subscribeFreeSpinsSocket();
      subscribeBetsSocket();
      this.subscribeOnlineSocket();
      if (runtimeConfig.public?.questsEnabled) subscribeQuestsSocket();
      if (runtimeConfig.public?.loyaltyEnabled) subscribeLoyaltySocket();
      subscribeNotificationSocket();

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
      const { unsubscribeQuestsSocket } = useQuestsStore();
      const { unsubscribeLoyaltySocket } = useLoyaltyStore();
      const { unsubscribeNotificationSocket } = useNotificationStore();
      unsubscribeAccountSocket();
      unsubscribeInvoiceSocket();
      unsubscribeBonusCodeSocket();
      unsubscribeBonusSocket();
      unsubscribeFreeSpinsSocket();
      unsubscribeBetsSocket();
      this.unsubscribeOnlineSocket();
      unsubscribeQuestsSocket();
      unsubscribeLoyaltySocket();
      unsubscribeNotificationSocket();
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
      const fingerprint = await this.fingerprintVisitor || undefined;
      const submitResult = await submitLoginData({
        ...loginData,
        fingerprint
      });
      await this.handleLogin(submitResult);
    },

    registrationSucceeded():void {
      const { showAlert, openWalletModal } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      const { closeModal } = useModalStore();

      showAlert(alertsData?.profile?.successRegistration || defaultLocaleAlertsData?.profile?.successRegistration);
      closeModal('sign-up');
      openWalletModal();
    },

    async loginSocial(socialData:any, authState?: IAuthState):Promise<void> {
      const { submitSocialLoginData } = useCoreAuthApi();
      const fingerprint = await this.fingerprintVisitor || undefined;
      const affiliateTag = useCookie('affiliateTag');
      const submitResult = await submitSocialLoginData({
        ...socialData,
        fingerprint,
        affiliateTag: affiliateTag.value || undefined
      });
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
      const fingerprint = await this.fingerprintVisitor || undefined;
      const submitResult = await submitAutologinData({
        token,
        fingerprint
      });
      await this.handleLogin(submitResult);
    },

    async registration(registrationData:any):Promise<void> {
      const { submitRegistrationData } = useCoreAuthApi();
      const fingerprint = await this.fingerprintVisitor || undefined;
      const affiliateTag = useCookie('affiliateTag');
      const submitResult = await submitRegistrationData({
        ...registrationData,
        fingerprint,
        affiliateTag: affiliateTag.value || undefined
      });
      await this.handleLogin(submitResult);
      useEvent('analyticsEvent', {
        event: 'registrationSuccess',
        regType: 'email'
      });
      this.registrationSucceeded();
    },

    async phoneRegistration(registrationData:any):Promise<void> {
      const { registerByPhone } = useCoreAuthApi();
      const fingerprint = await this.fingerprintVisitor || undefined;
      const affiliateTag = useCookie('affiliateTag');
      const submitResult = await registerByPhone({
        ...registrationData,
        fingerprint,
        affiliateTag: affiliateTag.value || undefined
      });
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

    subscribeOnlineSocket():void {
      const { createSubscription } = useWebSocket();
      this.onlineSubscription = createSubscription('global:online');
    },

    unsubscribeOnlineSocket():void {
      if (this.onlineSubscription) {
        this.onlineSubscription.unsubscribe();
        this.onlineSubscription.removeAllListeners();
      }
    },
  },
});

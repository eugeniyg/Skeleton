import { defineStore } from 'pinia';
import type { IProfile, IAuthorizationResponse, IParsedToken, ISocialCallbackData } from '@skeleton/core/types';
import { jwtDecode } from 'jwt-decode';
import { isStandalonePWA } from 'ua-parser-js/helpers';

interface IProfileStoreState {
  refreshPromise: Promise<string> | null;
  isLoggedIn: boolean;
  sessionId: string;
  resentVerifyEmail: boolean;
  profile: Maybe<IProfile>;
  socialAuthEmailError: boolean;
  tokenCookieKey: string;
  onlineSubscription: any;
  fingerprintVisitor: Promise<string> | null;
  isPwaRoute: boolean;
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
    fingerprintVisitor: null,
    isPwaRoute: false,
  }),

  getters: {
    userNickname(state): string {
      if (state.profile?.nickname) return state.profile.nickname;
      if (state.profile?.email) {
        const { getNicknameFromEmail } = useProjectMethods();
        return getNicknameFromEmail(state.profile.email);
      }
      return 'Unknown';
    },
  },

  actions: {
    setSessionToken(tokenValue: string): void {
      const cookieToken = useCookie(this.tokenCookieKey, { maxAge: 60 * 60 * 24 * 365 });
      cookieToken.value = tokenValue;
    },

    getSessionToken(): Maybe<string> {
      const cookieToken = useCookie(this.tokenCookieKey);
      return cookieToken.value;
    },

    isTokenExpired(): boolean {
      const token = this.getSessionToken();
      if (!token) return false;

      const currentSession: IParsedToken = jwtDecode(token);
      return currentSession.exp ? currentSession.exp - 10 < Date.now() / 1000 : false;
    },

    getCurrentSession(): IParsedToken | null {
      const token = this.getSessionToken();
      if (token) {
        return jwtDecode(token);
      }
      return null;
    },

    encodeSessionChange(key: 'login' | 'logout'): string {
      const time = Date.now();
      return window.btoa(`${time}-${key}`);
    },

    async removeSession(): Promise<void> {
      this.profile = undefined;
      const cookieToken = useCookie(this.tokenCookieKey);
      cookieToken.value = null;
      this.isLoggedIn = false;
      sessionStorage.removeItem('asyncInvoiceId');
      localStorage.setItem('changeSession', this.encodeSessionChange('logout'));

      const { updateChat } = useFreshchatStore();
      updateChat();

      const { deleteReturnGame } = useLayoutStore();
      deleteReturnGame();

      this.finishProfileDependencies();
      const { reconnectSocket } = useWebSocket();
      await reconnectSocket();
    },

    async getRefreshRequest(): Promise<string> {
      const storageRefreshStatus = localStorage.getItem('refreshSession');

      if (storageRefreshStatus === 'loading') {
        const { awaitRefreshParallel } = useProjectMethods();
        const newToken = await awaitRefreshParallel();
        if (newToken) {
          this.setSessionToken(newToken);
          return newToken;
        } else {
          await this.removeSession();
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
        await this.removeSession();
        localStorage.removeItem('refreshSession');
        return '';
      } finally {
        this.refreshPromise = null;
      }
    },

    refreshToken(): string | Promise<string> {
      if (this.refreshPromise) return this.refreshPromise;
      this.refreshPromise = this.getRefreshRequest();
      return this.refreshPromise;
    },

    startProfileDependencies(): void {
      const { getFavoriteGames, subscribeBetsSocket } = useGamesStore();
      const {
        getPlayerBonuses,
        getPlayerFreeSpins,
        getPlayerCashback,
        getDepositBonuses,
        subscribeBonusCodeSocket,
        subscribeBonusSocket,
        subscribeFreeSpinsSocket,
      } = useBonusStore();
      const { getActiveQuests, subscribeQuestsSocket } = useQuestsStore();
      const { getPlayerLoyalty, subscribeLoyaltySocket } = useLoyaltyStore();
      const { getPopoverNotifications, subscribeNotificationSocket } = useNotificationStore();
      const { subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      const { subscribeTournamentSocket } = useTournamentsStore();
      const { setEquivalentCurrency } = useGlobalStore();
      const runtimeConfig = useRuntimeConfig();

      getFavoriteGames();
      if (runtimeConfig.public?.questsEnabled) getActiveQuests();
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
      subscribeTournamentSocket();

      const storageEquivalentCurrency = localStorage.getItem('equivalentCurrency');
      if (storageEquivalentCurrency) setEquivalentCurrency(storageEquivalentCurrency);
    },

    finishProfileDependencies(): void {
      const bonusStore = useBonusStore();
      bonusStore.$reset();

      const { unsubscribeAccountSocket, unsubscribeInvoiceSocket } = useWalletStore();
      const { unsubscribeBonusCodeSocket, unsubscribeBonusSocket, unsubscribeFreeSpinsSocket } = useBonusStore();
      const { unsubscribeBetsSocket } = useGamesStore();
      const { unsubscribeQuestsSocket } = useQuestsStore();
      const { unsubscribeLoyaltySocket } = useLoyaltyStore();
      const { unsubscribeNotificationSocket } = useNotificationStore();
      const { unsubscribeTournamentSocket } = useTournamentsStore();
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
      unsubscribeTournamentSocket();
    },

    async handleLogin(authResponse: IAuthorizationResponse): Promise<void> {
      this.setSessionToken(authResponse.accessToken);
      this.profile = authResponse.profile;

      await nextTick();
      const { getUserAccounts } = useWalletStore();
      await getUserAccounts();

      this.isLoggedIn = true;
      localStorage.setItem('changeSession', this.encodeSessionChange('login'));

      const {
        public: { freshchatParams },
      } = useRuntimeConfig();
      const { updateChat, addFreshChatScript } = useFreshchatStore();
      if (freshchatParams?.guestAvailable) updateChat();
      else addFreshChatScript();

      const { reconnectSocket } = useWebSocket();
      await reconnectSocket();
      this.startProfileDependencies();
      await this.checkPwaDetect();
    },

    async logIn(loginData: any): Promise<void> {
      const { submitLoginData } = useCoreAuthApi();
      const fingerprint = (await this.fingerprintVisitor) || undefined;
      const submitResult = await submitLoginData({
        ...loginData,
        fingerprint,
      });
      await this.handleLogin(submitResult);
    },

    registrationSucceeded(): void {
      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      const { closeModal, openWalletModal } = useModalStore();

      showAlert(alertsData?.profile?.successRegistration || defaultLocaleAlertsData?.profile?.successRegistration);
      closeModal('sign-up');
      openWalletModal();
    },

    async loginSocial(data: ISocialCallbackData): Promise<void> {
      const { submitSocialLoginData } = useCoreAuthApi();
      const fingerprint = (await this.fingerprintVisitor) || undefined;
      const affiliateTag = useCookie('affiliateTag');
      const globalData = useGlobalStore();
      const submitResult = await submitSocialLoginData({
        ...data,
        query: data.query,
        provider: data.connection,
        locale: globalData.currentLocale?.code,
        fingerprint,
        affiliateTag: affiliateTag.value || undefined,
      });
      await this.handleLogin(submitResult);

      const appStateData: { backRoute: string } | undefined = data.query.state
        ? JSON.parse(data.query.state)
        : undefined;
      const router = useRouter();
      const { localizePath } = useProjectMethods();
      const backUrl = appStateData?.backRoute ? decodeURIComponent(appStateData.backRoute) : undefined;
      await router.replace(backUrl || localizePath('/'));

      if (submitResult.profile?.isNewlyRegistered) {
        useEvent('analyticsEvent', {
          event: 'registrationSuccess',
          regType: 'social',
        });
        this.registrationSucceeded();
      }
    },

    async autoLogin(token: string): Promise<void> {
      const { submitAutologinData } = useCoreAuthApi();
      const fingerprint = (await this.fingerprintVisitor) || undefined;
      const submitResult = await submitAutologinData({
        token,
        fingerprint,
      });
      await this.handleLogin(submitResult);
    },

    async registration(registrationData: any): Promise<void> {
      const { submitRegistrationData } = useCoreAuthApi();
      const fingerprint = (await this.fingerprintVisitor) || undefined;
      const affiliateTag = useCookie('affiliateTag');
      const submitResult = await submitRegistrationData({
        ...registrationData,
        fingerprint,
        affiliateTag: affiliateTag.value || undefined,
      });
      await this.handleLogin(submitResult);
      useEvent('analyticsEvent', {
        event: 'registrationSuccess',
        regType: 'email',
      });
      this.registrationSucceeded();
    },

    async phoneRegistration(registrationData: any): Promise<void> {
      const { registerByPhone } = useCoreAuthApi();
      const fingerprint = (await this.fingerprintVisitor) || undefined;
      const affiliateTag = useCookie('affiliateTag');
      const submitResult = await registerByPhone({
        ...registrationData,
        fingerprint,
        affiliateTag: affiliateTag.value || undefined,
      });
      await this.handleLogin(submitResult);
      useEvent('analyticsEvent', {
        event: 'registrationSuccess',
        regType: 'phone',
      });
      this.registrationSucceeded();
    },

    async getProfileData(): Promise<void> {
      const { getProfile } = useCoreProfileApi();
      this.profile = await getProfile();
      this.isLoggedIn = true;
    },

    setProfileData(data: IProfile): void {
      this.profile = data;
    },

    async logOutUser(): Promise<void> {
      const { logOut } = useCoreAuthApi();
      try {
        await logOut();
      } finally {
        await this.removeSession();

        const router = useRouter();
        const { localizePath } = useProjectMethods();
        await router.push(localizePath('/'));
      }
    },

    async resendVerifyEmail(): Promise<void> {
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

    subscribeOnlineSocket(): void {
      const { createSubscription } = useWebSocket();
      this.onlineSubscription = createSubscription('global:online');
    },

    unsubscribeOnlineSocket(): void {
      if (this.onlineSubscription) {
        this.onlineSubscription.unsubscribe();
        this.onlineSubscription.removeAllListeners();
      }
    },

    async checkPwaDetect(): Promise<void> {
      if (!this.isLoggedIn || !this.profile || this.profile.pwaInstalled) return;
      const isStandalone = isStandalonePWA();

      if (isStandalone || this.isPwaRoute) {
        const { changeProfileData } = useCoreProfileApi();
        try {
          this.profile = await changeProfileData({ pwaInstalled: true });
        } catch {
          console.error('Personal data not changed!');
        }
      }
    },
  },
});

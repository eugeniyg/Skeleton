import type { IProfile, IAuthorizationResponse, IParsedToken, ISocialCallbackData } from '@skeleton/api/types';
import { jwtDecode } from 'jwt-decode';
import { isStandalonePWA } from 'ua-parser-js/helpers';
import {
  submitRegistrationData,
  submitLoginData,
  submitAutologinData,
  refreshToken,
  submitSocialLoginData,
  registerByPhone,
  logOut,
} from '@skeleton/api/auth';
import { getProfile, resendVerificationEmail, changeProfileData } from '@skeleton/api/profile';
import { getNicknameFromEmail } from '@skeleton/helpers/simpleMethods';

interface IProfileStoreState {
  refreshPromise: Promise<string> | null;
  isLoggedIn: boolean;
  sessionId: string;
  resentVerifyEmail: boolean;
  profile: Maybe<IProfile>;
  socialAuthEmailError: boolean;
  tokenCookieKey: string;
  onlineSubscription: any;
  isPwaRoute: boolean;
  fingerprintPromise: Promise<string> | null;
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
    isPwaRoute: false,
    fingerprintPromise: null,
  }),

  getters: {
    userNickname(state): string {
      if (state.profile?.nickname) return state.profile.nickname;
      if (state.profile?.email) {
        return getNicknameFromEmail(state.profile.email);
      }
      return 'Unknown';
    },
  },

  actions: {
    async getFingerprintRequest(): Promise<string> {
      const { $fingerprint } = useNuxtApp();
      const fpResponse = await $fingerprint.get();
      return fpResponse.visitorId;
    },

    getFingerprintVisitor(): Promise<string> {
      if (!this.fingerprintPromise) this.fingerprintPromise = this.getFingerprintRequest();
      return this.fingerprintPromise;
    },

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

      const { projectHasFreshchat, updateFreshChat } = useFreshchatStore();
      const { projectHasLiveChat, updateLiveChat } = useLiveChatStore();
      if (projectHasLiveChat) updateLiveChat();
      else if (projectHasFreshchat) updateFreshChat();

      const { deleteReturnGame } = useLayoutStore();
      deleteReturnGame();

      this.finishProfileDependencies();
      const { reconnectSocket } = useWebSocketStore();
      await reconnectSocket();
    },

    async awaitRefreshParallel(): Promise<string | null> {
      return new Promise(resolve => {
        let iteration = 1;

        const checkStorage = (): void => {
          setTimeout(() => {
            if (iteration > 10) {
              localStorage.removeItem('refreshSession');
              resolve(null);
            }
            iteration += 1;
            const storageValue = localStorage.getItem('refreshSession');
            if (storageValue === 'loading') checkStorage();
            else resolve(storageValue);
          }, 500);
        };

        checkStorage();
      });
    },

    async getRefreshRequest(): Promise<string> {
      const storageRefreshStatus = localStorage.getItem('refreshSession');

      if (storageRefreshStatus === 'loading') {
        const newToken = await this.awaitRefreshParallel();
        if (newToken) {
          this.setSessionToken(newToken);
          return newToken;
        } else {
          await this.removeSession();
          return '';
        }
      }

      localStorage.setItem('refreshSession', 'loading');
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
      const { subscribeAccountSocket, subscribeInvoicesSocket, getPaymentStatistics } = useWalletStore();
      const { subscribeTournamentSocket } = useTournamentsStore();
      const { subscribeWheelsSocket } = useWheelsStore();
      const { subscribeLotterySocket } = useLotteryStore();
      const { setEquivalentCurrency } = useGlobalStore();
      const runtimeConfig = useRuntimeConfig();

      getFavoriteGames();
      if (runtimeConfig.public?.questsEnabled) getActiveQuests();
      if (runtimeConfig.public?.loyaltyEnabled) getPlayerLoyalty();
      getPopoverNotifications();
      getPlayerCashback();
      getPaymentStatistics();

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
      subscribeWheelsSocket();
      subscribeLotterySocket();

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
      const { unsubscribeWheelsSocket } = useWheelsStore();
      const { unsubscribeLotterySocket } = useLotteryStore();
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
      unsubscribeWheelsSocket();
      unsubscribeLotterySocket();
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
        public: { liveChat, freshchatParams },
      } = useRuntimeConfig();
      const { projectHasLiveChat, initializeLiveChat, updateLiveChat } = useLiveChatStore();
      const { projectHasFreshchat, updateFreshChat, addFreshChatScript } = useFreshchatStore();

      if (projectHasLiveChat) {
        if (liveChat.guestAvailable) updateLiveChat();
        else initializeLiveChat();
      } else if (projectHasFreshchat) {
        if (freshchatParams?.guestAvailable) updateFreshChat();
        else addFreshChatScript();
      }

      const { reconnectSocket } = useWebSocketStore();
      await reconnectSocket();
      this.startProfileDependencies();
      await this.checkPwaDetect();
    },

    async logIn(loginData: any): Promise<void> {
      const fingerprint = await this.getFingerprintVisitor();
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
      const fingerprint = await this.getFingerprintVisitor();
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
      const backUrl = appStateData?.backRoute ? decodeURIComponent(appStateData.backRoute) : undefined;
      await router.replace(backUrl || localizePath('/'));

      if (submitResult.profile?.isNewlyRegistered) {
        useEvent('analyticsEvent', {
          event: 'registrationSuccess',
          regType: 'social',
        });
        setTimeout(this.registrationSucceeded, 1000);
      }
    },

    async autoLogin(token: string): Promise<void> {
      const fingerprint = await this.getFingerprintVisitor();
      const submitResult = await submitAutologinData({
        token,
        fingerprint,
      });
      await this.handleLogin(submitResult);
    },

    async registration(registrationData: any): Promise<void> {
      const fingerprint = await this.getFingerprintVisitor();
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
      const fingerprint = await this.getFingerprintVisitor();
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
      this.profile = await getProfile();
      this.isLoggedIn = true;
    },

    setProfileData(data: IProfile): void {
      this.profile = data;
    },

    async logOutUser(): Promise<void> {
      try {
        await logOut();
      } finally {
        await this.removeSession();

        const router = useRouter();
        await router.push(localizePath('/'));
      }
    },

    async resendVerifyEmail(): Promise<void> {
      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      try {
        await resendVerificationEmail();
        showAlert(alertsData?.profile?.resentVerification || defaultLocaleAlertsData?.profile?.resentVerification);
      } catch {
        showAlert(alertsData?.global?.somethingWrong || defaultLocaleAlertsData?.global?.somethingWrong);
      } finally {
        this.resentVerifyEmail = true;
      }
    },

    subscribeOnlineSocket(): void {
      const { createSubscription } = useWebSocketStore();
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
        try {
          this.profile = await changeProfileData({ pwaInstalled: true });
        } catch {
          console.error('Personal data not changed!');
        }
      }
    },
  },
});

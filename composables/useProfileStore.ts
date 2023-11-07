import { defineStore } from 'pinia';
import type {
  IProfile,
  IAuthorizationResponse,
  IParsedToken
} from '@skeleton/core/types';
import { jwtDecode } from "jwt-decode";

interface IProfileStoreState {
  refreshPromise: Promise<{data: IAuthorizationResponse}>|null;
  currentSessionToken: string|null;
  isLoggedIn: boolean;
  sessionId: string;
  resentVerifyEmail: boolean;
  profile: Maybe<IProfile>;
}

export const useProfileStore = defineStore('profileStore', {
  state: (): IProfileStoreState => ({
    refreshPromise: null,
    currentSessionToken: null,
    isLoggedIn: false,
    sessionId: '',
    resentVerifyEmail: false,
    profile: undefined,
  }),

  getters: {
    userNickname(state):string {
      return state.profile?.nickname || 'Unknown';
    },
  },

  actions: {
    setSessionToken (tokenValue:string):void {
      const cookieToken = useCookie('access_token', { maxAge: 60 * 60 * 24 * 30 });
      cookieToken.value = tokenValue;
      this.currentSessionToken = tokenValue;
    },

    getSessionToken ():string|null|undefined {
      const cookieToken = useCookie('access_token');
      return this.currentSessionToken || cookieToken.value;
    },

    isTokenExpired ():boolean {
      const token = this.getSessionToken();
      if (token) {
        const currentSession:IParsedToken = jwtDecode(token);
        return currentSession.exp ? currentSession.exp <= Date.now() / 1000 : false;
      }
      return true;
    },

    getCurrentSession ():IParsedToken|null {
      const token = this.getSessionToken();
      if (token) {
        return jwtDecode(token);
      }
      return null;
    },

    removeSession ():void {
      const cookieToken = useCookie('access_token')
      cookieToken.value = null
      this.currentSessionToken = null
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

    async logIn(loginData:any):Promise<void> {
      const { submitLoginData } = useCoreAuthApi();
      const { getUserAccounts } = useWalletStore();
      const submitResult = await submitLoginData(loginData);
      this.startSession(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      this.startProfileDependencies();
    },

    async registration(registrationData:any):Promise<void> {
      const { submitRegistrationData } = useCoreAuthApi();
      const { getUserAccounts } = useWalletStore();
      const submitResult = await submitRegistrationData(registrationData);
      this.startSession(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      this.startProfileDependencies();
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
        this.finishProfileDependencies();
        const { deleteReturnGame } = useLayoutStore();
        deleteReturnGame();
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

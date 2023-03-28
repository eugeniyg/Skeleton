import { defineStore } from 'pinia';
import {
  ProfileInterface,
  AuthorizationResponseInterface,
  WebSocketResponseInterface,
  SocketBonusNotifyInterface,
} from '@platform/frontend-core/dist/module';
import { useWalletStore } from '~/composables/useWalletStore';
import { useLayoutStore } from '~/composables/useLayoutStore';
import { useGamesStore } from '~/composables/useGamesStore';
import { useProjectMethods } from '~/composables/useProjectMethods';
import { useGlobalStore } from '~/composables/useGlobalStore';

interface ProfileStoreStateInterface {
  isLoggedIn: boolean,
  sessionId: string,
  resentVerifyEmail: boolean,
  profile: Maybe<ProfileInterface>,
  bonusSubscription: any,
}

export const useProfileStore = defineStore('profileStore', {
  state: (): ProfileStoreStateInterface => ({
    isLoggedIn: false,
    sessionId: '',
    resentVerifyEmail: false,
    profile: undefined,
    bonusSubscription: undefined,
  }),

  getters: {
    userNickname(state):string {
      return state.profile?.nickname || 'Unknown';
    },
  },

  actions: {
    startSession(authData: AuthorizationResponseInterface):void {
      this.profile = authData.profile;
      const { reconnectSocket } = useWebSocket();
      reconnectSocket();
    },

    subscribeProfileSockets():void {
      const { subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      subscribeAccountSocket();
      subscribeInvoicesSocket();
      this.subscribeBonusSocket();
    },

    unsubscribeProfileSockets():void {
      const { unsubscribeAccountSocket, unsubscribeInvoiceSocket } = useWalletStore();
      unsubscribeAccountSocket();
      unsubscribeInvoiceSocket();
      this.unsubscribeBonusSocket();
    },

    async logIn(loginData:any):Promise<void> {
      const { submitLoginData } = useCoreAuthApi();
      const { getUserAccounts } = useWalletStore();
      const submitResult = await submitLoginData(loginData);
      this.startSession(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      this.subscribeProfileSockets();
      const { getFavoriteGames } = useGamesStore();
      getFavoriteGames();
    },

    async registration(registrationData:any):Promise<void> {
      const { submitRegistrationData } = useCoreAuthApi();
      const { getUserAccounts } = useWalletStore();
      const submitResult = await submitRegistrationData(registrationData);
      this.startSession(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      this.subscribeProfileSockets();
      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      showAlert(alertsData?.successRegistration || defaultLocaleAlertsData?.successRegistration);
    },

    async getProfileData():Promise<void> {
      const { getProfile } = useCoreProfileApi();
      const profileInfo = await getProfile();
      this.profile = profileInfo;
      this.isLoggedIn = true;
    },

    setProfileData(data: ProfileInterface):void {
      this.profile = data;
    },

    async logOutUser():Promise<void> {
      const { logOut } = useCoreAuthApi();
      try {
        await logOut();
      } finally {
        this.isLoggedIn = false;
        this.unsubscribeProfileSockets();
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
        showAlert(alertsData?.resentVerification || defaultLocaleAlertsData?.resentVerification);
      } catch {
        showAlert(alertsData?.somethingWrong || defaultLocaleAlertsData?.somethingWrong);
      } finally {
        this.resentVerifyEmail = true;
      }
    },

    subscribeBonusSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        console.log('subscribe channel');
        this.bonusSubscription = createSubscription(`bonus:player-bonus-codes#${profileStore.profile.id}`, this.showBonusNotification);
      }
    },

    unsubscribeBonusSocket():void {
      if (this.bonusSubscription) {
        this.bonusSubscription.unsubscribe();
        this.bonusSubscription.removeAllListeners();
      }
    },

    showBonusNotification(webSocketResponse:WebSocketResponseInterface):void {
      console.log('catch event');
      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();

      const bonusNotificationData: Maybe<SocketBonusNotifyInterface> = webSocketResponse.data.playerBonusCode;

      switch (bonusNotificationData?.status) {
        case 1:
          showAlert(alertsData?.bonusActivated || defaultLocaleAlertsData?.bonusActivated);
          break;
        case 2:
          showAlert(alertsData?.bonusIncorrect || defaultLocaleAlertsData?.bonusIncorrect);
          break;
        case 3:
          showAlert(alertsData?.bonusNotAvailable || defaultLocaleAlertsData?.bonusNotAvailable);
          break;
        default:
          break;
      }
    },
  },
});

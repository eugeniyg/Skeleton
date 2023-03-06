import { defineStore } from 'pinia';
import {
  ProfileInterface, AuthorizationResponseInterface,
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
}

export const useProfileStore = defineStore('profileStore', {
  state: (): ProfileStoreStateInterface => ({
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
    startSession(authData: AuthorizationResponseInterface):void {
      this.profile = authData.profile;
      const { reconnectSocket } = useWebSocket();
      reconnectSocket();
    },

    async logIn(loginData:any):Promise<void> {
      const { submitLoginData } = useCoreAuthApi();
      const { getUserAccounts, subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      const submitResult = await submitLoginData(loginData);
      this.startSession(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      subscribeAccountSocket();
      subscribeInvoicesSocket();
      const { getFavoriteGames } = useGamesStore();
      getFavoriteGames();
    },

    async registration(registrationData:any):Promise<void> {
      const { submitRegistrationData } = useCoreAuthApi();
      const { getUserAccounts, subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      const submitResult = await submitRegistrationData(registrationData);
      this.startSession(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      subscribeAccountSocket();
      subscribeInvoicesSocket();
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
        const { unsubscribeAccountSocket, unsubscribeInvoiceSocket } = useWalletStore();
        unsubscribeAccountSocket();
        unsubscribeInvoiceSocket();
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
  },
});

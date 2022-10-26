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
  avatarItems: {
    label: string,
    nickname: string,
    amount: any,
  },
  sessionId: string,
  resentVerifyEmail: boolean,
  profile: ProfileInterface|undefined,
}

export const useProfileStore = defineStore('profileStore', {
  state: (): ProfileStoreStateInterface => ({
    isLoggedIn: false,
    avatarItems: {
      label: '25 lvl',
      nickname: 'Twiy_nikname_96',
      amount: [0, 0.00004682, 'BTC'],
    },
    sessionId: '',
    resentVerifyEmail: false,
    profile: undefined,
  }),

  getters: {
    userNickname(state):string {
      return state.profile?.nickname || 'Unknown';
    },

    playerStatusName(state):string {
      const { playerStatuses } = useCoreStore();
      return playerStatuses.find((status) => status.id === state.profile?.status)?.name;
    },
  },

  actions: {
    setToken(authData: AuthorizationResponseInterface):void {
      const bearer = useCookie('bearer', { maxAge: 60 * 60 * 24 * 365 * 10 });
      bearer.value = authData.accessToken;
      this.sessionId = authData.sessionId;
      this.profile = authData.profile;
      const { reconnectSocket } = useWebSocket();
      reconnectSocket();
    },

    async logIn(loginData:any):Promise<void> {
      const { submitLoginData } = useCoreAuthApi();
      const { getUserAccounts, subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      const submitResult = await submitLoginData(loginData);
      this.setToken(submitResult);
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
      this.setToken(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      subscribeAccountSocket();
      subscribeInvoicesSocket();
      const { showAlert } = useLayoutStore();
      const { alertsData } = useGlobalStore();
      showAlert(alertsData?.successRegistration);
    },

    async getProfileData():Promise<void> {
      const { getProfile } = useCoreProfileApi();
      const profileInfo = await getProfile();
      console.log('Profile info:', profileInfo);
      this.profile = profileInfo;
      this.isLoggedIn = true;
    },

    setProfileData(data: ProfileInterface):void {
      this.profile = data;
    },

    async logOutUser(needRequest:boolean = true):Promise<void> {
      const { logOut } = useCoreAuthApi();
      const bearer = useCookie('bearer');
      try {
        if (needRequest) await logOut();
      } finally {
        bearer.value = undefined;
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
      const { alertsData } = useGlobalStore();
      const { resendVerifyEmail } = useCoreProfileApi();
      try {
        await resendVerifyEmail();
        showAlert(alertsData?.resentVerification);
      } catch {
        showAlert(alertsData?.somethingWrong);
      } finally {
        this.resentVerifyEmail = true;
      }
    },
  },
});

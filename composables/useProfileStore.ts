import { defineStore } from 'pinia';
import {
  ProfileInterface, AuthorizationResponseInterface,
} from '@platform/frontend-core/dist/module';
import { useWalletStore } from '~/composables/useWalletStore';
import { useLayoutStore } from '~/composables/useLayoutStore';
import { useGamesStore } from '~/composables/useGamesStore';
import { useProjectMethods } from '~/composables/useProjectMethods';

export type ProfileStoreStateType = {
  isLoggedIn: boolean,
  avatarItems: {
    label: string,
    nickname: string,
    amount: any,
  },
  sessionId: string,
  profile: ProfileInterface|undefined,
}

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    isLoggedIn: false,
    avatarItems: {
      label: '25 lvl',
      nickname: 'Twiy_nikname_96',
      amount: [0, 0.00004682, 'BTC'],
    },
    sessionId: '',
    profile: undefined,
  } as ProfileStoreStateType),

  getters: {
    userNickname():string {
      return this.profile.nickname || 'Unknown';
    },
  },

  actions: {
    setToken(authData: AuthorizationResponseInterface):void {
      const bearer = useCookie('bearer', { maxAge: 60 * 60 * 24 * 365 * 10 });
      bearer.value = authData.accessToken;
      this.sessionId = authData.sessionId;
      this.profile = authData.profile;
    },

    async logIn(loginData:any):Promise<void> {
      const { submitLoginData } = useCoreAuthApi();
      const { getUserAccounts } = useWalletStore();
      const submitResult = await submitLoginData(loginData);
      this.setToken(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      const { getFavoriteGames } = useGamesStore();
      getFavoriteGames();
    },

    async registration(registrationData:any):Promise<void> {
      const { submitRegistrationData } = useCoreAuthApi();
      const { getUserAccounts } = useWalletStore();
      const submitResult = await submitRegistrationData(registrationData);
      this.setToken(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
      const { showAlert } = useLayoutStore();
      showAlert({
        title: 'Welcome',
        text: 'You have been successfully registered!',
        variant: 'done',
      });
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
      const bearer = useCookie('bearer');
      try {
        await logOut();
      } finally {
        bearer.value = undefined;
        this.isLoggedIn = false;
        const router = useRouter();
        const { localizePath } = useProjectMethods();
        router.push(localizePath('/'));
      }
    },
  },
});

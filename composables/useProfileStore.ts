import { defineStore } from 'pinia';
import { useAuthApi, useProfileApi } from '~/CORE/index';
import { ProfileInterface } from '~/types/userTypes';
import { FieldInterface } from '~/types/formTypes';
import { useWalletStore } from '~/composables/useWalletStore';
import { useLayoutStore } from '~/composables/useLayoutStore';

export type ProfileStoreStateType = {
  isLoggedIn: boolean,
  avatarItems: {
    label: string,
    nickname: string,
    amount: any,
  },
  sessionId: string,
  registrationFields: FieldInterface[],
  profile: ProfileInterface|undefined,
  profileFields: FieldInterface[],
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
    registrationFields: [],
    profileFields: [],
  } as ProfileStoreStateType),

  getters: {
    publicNickname():string {
      if (!this.isLoggedIn) return '';

      if (!this.profile.nickname) {
        const getFirstPath = this.profile.email.split('@')[0];
        if (getFirstPath.length < 4) return `${getFirstPath.slice(0, 1)}***`;
        return `${getFirstPath.slice(0, -3)}***`;
      }
      return this.profile.nickname;
    },
  },

  actions: {
    setToken(authData:any):void {
      const bearer = useCookie('bearer');
      bearer.value = authData.accessToken;
      this.sessionId = authData.sessionId;
      this.profile = authData.profile;
    },

    async logIn(loginData:any):Promise<any> {
      const { submitLoginData } = useAuthApi();
      const { getUserAccounts } = useWalletStore();
      const submitResult = await submitLoginData(loginData);
      this.setToken(submitResult);
      await nextTick();
      await getUserAccounts();
      this.isLoggedIn = true;
    },

    async registration(registrationData:any):Promise<any> {
      const { submitRegistrationData } = useAuthApi();
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
      const { getProfile } = useProfileApi();
      const profileInfo = await getProfile();
      this.profile = profileInfo;
      this.isLoggedIn = true;
    },

    setProfileData(data:ProfileInterface):void {
      this.profile = data;
    },

    async logOutUser():Promise<void> {
      const { logOut } = useAuthApi();
      const bearer = useCookie('bearer');
      try {
        await logOut();
      } finally {
        bearer.value = undefined;
        this.isLoggedIn = false;
        const router = useRouter();
        router.push({ name: 'index' });
      }
    },

    async getProfileFields():Promise<void> {
      const { getProfileFields } = useProfileApi();
      const data = await getProfileFields();
      this.profileFields = data;
    },

    async getRegistrationFields():Promise<void> {
      const { getRegistrationFields } = useAuthApi();
      const data = await getRegistrationFields();
      this.registrationFields = data;
    },
  },
});

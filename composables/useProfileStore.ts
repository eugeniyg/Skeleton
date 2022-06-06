import { defineStore } from 'pinia';
import { useAuthApi, useProfileApi } from '~/CORE/index';
import { profileInterface } from '~/types/userTypes';
import { fieldInterface } from '~/types/formTypes';
import { useWalletStore } from '~/composables/useWalletStore';
// import {nextTick} from "@vue/runtime-core";

export type profileStoreStateType = {
  isLoggedIn: boolean,
  avatarItems: {
    label: string,
    nickname: string,
    amount: any,
  },
  sessionId: string,
  registrationFields: fieldInterface[],
  profile: profileInterface|undefined,
  profileFields: fieldInterface[],
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
  } as profileStoreStateType),

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
    },

    async getProfileData():Promise<void> {
      const { getProfile } = useProfileApi();
      const profileInfo = await getProfile();
      this.profile = profileInfo;
      this.isLoggedIn = true;
    },

    setProfileData(data:profileInterface):void {
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

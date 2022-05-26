import { defineStore } from 'pinia';
import { useAuthApi, useProfileApi } from '@platform/frontend-core';
import { profileInterface } from '~/types/userTypes';
import { fieldInterface } from '~/types/formTypes';

export type userStoreStateType = {
  isLoggedIn: boolean,
  avatarItems: {
    label: string,
    nickname: string,
    amount: any,
  },
  sessionId: string,
  profile: profileInterface|undefined,
  profileFields: fieldInterface[],
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    isLoggedIn: false,
    avatarItems: {
      label: '25 lvl',
      nickname: 'Twiy_nikname_96',
      amount: [0, 0.00004682, 'BTC'],
    },
    sessionId: '',
    profile: undefined,
    profileFields: [],
  } as userStoreStateType),

  actions: {
    setToken(authData:any):void {
      const bearer = useCookie('bearer');
      bearer.value = authData.accessToken;
      this.sessionId = authData.sessionId;
      this.profile = authData.profile;
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

    async getProfileFields():Promise<any> {
      const { getProfileFields } = useProfileApi();
      try {
        const data = await getProfileFields();
        this.profileFields = data;
        return data;
      } catch (error) {
        return {
          error: error.error,
          response: error.response,
          data: error.data,
          base: error,
        };
      }
    },
  },
});

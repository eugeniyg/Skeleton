import { defineStore } from 'pinia';
import { useAuthApi } from '@platform/frontend-core';
import { profileInterface } from '~/types/userTypes';

export type userStoreStateType = {
  isLoggedIn: boolean,
  avatarItems: {
    label: string,
    nickname: string,
    amount: any,
  },
  sessionId: string,
  profile: profileInterface|undefined,
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
      const { getProfile } = useAuthApi();
      const profileInfo = await getProfile();
      this.profile = profileInfo.profile;
      this.isLoggedIn = true;
    },

    async logOutUser():Promise<void> {
      const { logOut } = useAuthApi();
      const bearer = useCookie('bearer');
      try {
        await logOut();
      } finally {
        bearer.value = undefined;
        this.isLoggedIn = false;
      }
    },
  },
});

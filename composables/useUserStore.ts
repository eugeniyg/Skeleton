import { defineStore } from 'pinia';

export type userStoreStateType = {
  isLoggedIn: boolean,
  avatarItems: {
    label: string,
    nickname: string,
    amount: any,
  },
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    isLoggedIn: false,
    avatarItems: {
      label: '25 lvl',
      nickname: 'Twiy_nikname_96',
      amount: [0, 0.00004682, 'BTC'],
    },
  } as userStoreStateType),

  actions: {
    logIn():void {
      this.isLoggedIn = true;
    },

    logOut():void {
      this.isLoggedIn = false;
    },
  },
});

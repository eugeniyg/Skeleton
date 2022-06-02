import { defineStore } from 'pinia';
import { accountInterface } from '~/types/walletTypes';
import {useProfileApi} from "~/CORE";

export type walletStateType = {
  accounts: accountInterface[],
}

export const useWalletStore = defineStore('walletStore', {
  state: () => ({
    accounts: [],
  } as walletStateType),

  actions: {
    async getProfileFields():Promise<void> {
      const { getProfileFields } = useProfileApi();
      const data = await getProfileFields();
      this.profileFields = data;
    },
  },
});

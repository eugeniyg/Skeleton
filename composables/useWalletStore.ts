import { defineStore } from 'pinia';
import { accountInterface } from '~/types/walletTypes';
import { useWalletApi } from '~/CORE';

export type walletStateType = {
  accounts: accountInterface[],
  accountsStatuses: {
    Active: 1,
    Inactive: 2,
    Hidden: 3,
    Disabled: 4,
  }
}

export const useWalletStore = defineStore('walletStore', {
  state: () => ({
    accounts: [],
  } as walletStateType),

  getters: {
    activeAccount():accountInterface {
      return this.accounts.find((acc) => acc.status === 1);
    },
  },

  actions: {
    async getUserAccounts():Promise<void> {
      const { getAccounts } = useWalletApi();
      const data = await getAccounts();
      this.accounts = data;
    },
  },
});

import { defineStore } from 'pinia';
import { AccountInterface, AccountRequestInterface } from '~/types/walletTypes';
import { useWalletApi } from '~/CORE';

export type WalletStateType = {
  accounts: AccountInterface[],
  depositMethods: any[],
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
    depositMethods: [],
  } as WalletStateType),

  getters: {
    activeAccount():AccountInterface {
      return this.accounts.find((acc) => acc.status === 1);
    },
  },

  actions: {
    async getUserAccounts():Promise<void> {
      const { getAccounts } = useWalletApi();
      const data = await getAccounts();
      this.accounts = data;
    },

    async createAccount(currency: string):Promise<void> {
      const { addAccount } = useWalletApi();
      const data = await addAccount({ currency });
      this.accounts = data;
    },

    async switchAccount(switchData: AccountRequestInterface):Promise<void> {
      const { switchActiveAccount } = useWalletApi();
      const data = await switchActiveAccount(switchData);
      this.accounts = data;
    },

    async hideAccount(hideData: AccountRequestInterface):Promise<void> {
      const { hideWalletAccount } = useWalletApi();
      const data = await hideWalletAccount(hideData);
      this.accounts = data;
    },

    async getDepositMethods():Promise<void> {
      const { getDepositMethods } = useWalletApi();
      const data = await getDepositMethods(this.activeAccount.id, this.activeAccount.formatBalance.currency);
      this.depositMethods = data;
    },
  },
});

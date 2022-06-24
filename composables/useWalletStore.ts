import { defineStore, storeToRefs } from 'pinia';
import { AccountInterface, AccountRequestInterface } from '~/types/walletTypes';
import { useWalletApi } from '~/CORE';
import { useGlobalStore } from '~/composables/useGlobalStore';
import { useProfileStore } from '~/composables/useProfileStore';
import { CurrencyInterface } from '~/types/globalDataTypes';

export type WalletStateType = {
  accounts: AccountInterface[],
  depositMethods: any[],
  withdrawMethods: any[],
  requestTimer: any,
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
    withdrawMethods: [],
    requestTimer: '',
  } as WalletStateType),

  getters: {
    activeAccount():AccountInterface {
      return this.accounts.find((acc) => acc.status === 1);
    },

    activeCurrency():CurrencyInterface {
      const globalStore = useGlobalStore();
      const { currencies } = storeToRefs(globalStore);

      return currencies.value.find((currency) => {
        if (!currency.subCurrencies.length) {
          return currency.code === this.activeAccount.formatBalance.currency;
        }
        return currency.code === this.activeAccount.formatBalance.currency || currency.subCurrencies.some((sub) => sub.code === this.activeAccount.formatBalance.currency);
      });
    },

    activeAccountType():string {
      return this.activeCurrency.type;
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
      const data = await getDepositMethods(this.activeAccount.id, this.activeCurrency.code);
      this.depositMethods = data;
    },

    async getWithdrawMethods():Promise<void> {
      const { getWithdrawMethods } = useWalletApi();
      const data = await getWithdrawMethods(this.activeAccount.id, this.activeCurrency.code);
      this.withdrawMethods = data;
    },

    async updateAccounts():Promise<void> {
      const { isLoggedIn } = useProfileStore();
      if (isLoggedIn) await this.getUserAccounts();
      this.requestTimer = setTimeout(() => {
        this.updateAccounts();
      }, 30000);
    },

    stopUpdateAccounts():void {
      const { isLoggedIn } = useProfileStore();
      clearTimeout(this.requestTimer);
      if (isLoggedIn) this.getUserAccounts();
    },
  },
});

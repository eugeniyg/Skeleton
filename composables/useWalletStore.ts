import { defineStore, storeToRefs } from 'pinia';
import { AccountInterface, AccountRequestInterface, WebSocketResponseInterface } from '@platform/frontend-core/dist/module';
import { useGlobalStore } from '~/composables/useGlobalStore';
import { useProfileStore } from '~/composables/useProfileStore';

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
  },
  accountSubscription: any,
}

export const useWalletStore = defineStore('walletStore', {
  state: () => ({
    accounts: [],
    depositMethods: [],
    withdrawMethods: [],
    requestTimer: '',
    accountSubscription: undefined,
  } as WalletStateType),

  getters: {
    activeAccount():AccountInterface {
      return this.accounts.find((acc) => acc.status === 1);
    },

    activeAccountType():string {
      const globalStore = useGlobalStore();
      const { currencies } = storeToRefs(globalStore);

      const activeCurrency = currencies.value.find((currency) => currency.code === this.activeAccount.currency);
      return activeCurrency.type;
    },
  },

  actions: {
    async getUserAccounts():Promise<void> {
      const { getAccounts } = useCoreWalletApi();
      const data = await getAccounts();
      this.accounts = data;
    },

    async createAccount(currency: string):Promise<void> {
      const { addAccount } = useCoreWalletApi();
      const data = await addAccount(currency);
      this.accounts = data;
    },

    async switchAccount(switchData: AccountRequestInterface):Promise<void> {
      const { switchActiveAccount } = useCoreWalletApi();
      const data = await switchActiveAccount(switchData);
      this.accounts = data;
    },

    async hideAccount(hideData: AccountRequestInterface):Promise<void> {
      const { hideWalletAccount } = useCoreWalletApi();
      const data = await hideWalletAccount(hideData);
      this.accounts = data;
    },

    async getDepositMethods():Promise<void> {
      const { getDepositMethods } = useCoreWalletApi();
      const data = await getDepositMethods(this.activeAccount.currency);
      this.depositMethods = data;
    },

    async getWithdrawMethods():Promise<void> {
      const { getWithdrawMethods } = useCoreWalletApi();
      const data = await getWithdrawMethods(this.activeAccount.currency);
      this.withdrawMethods = data;
    },

    subscribeAccountSocket():void {
      const { createSubscription } = useWebSocket();
      const profileStore = useProfileStore();
      this.accountSubscription = createSubscription(`wallet:accounts#${profileStore.profile.id}`, this.updateAccount);
    },

    unsubscribeAccountSocket():void {
      if (this.accountSubscription) {
        this.accountSubscription.unsubscribe();
        this.accountSubscription.removeAllListeners();
      }
    },

    updateAccount(webSocketResponse:WebSocketResponseInterface):void {
      const accountData:AccountInterface = webSocketResponse.data.account;
      this.accounts = this.accounts.map((account) => {
        if (account.id === accountData.id) return accountData;
        return account;
      });
    },
  },
});

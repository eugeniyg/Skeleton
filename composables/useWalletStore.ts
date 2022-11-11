import { defineStore, storeToRefs } from 'pinia';
import { AccountInterface, AccountRequestInterface, WebSocketResponseInterface } from '@platform/frontend-core/dist/module';
import { useGlobalStore } from '~/composables/useGlobalStore';
import { useProfileStore } from '~/composables/useProfileStore';
import { useProjectMethods } from '~/composables/useProjectMethods';

interface WalletStateInterface {
  accounts: AccountInterface[],
  depositMethods: any[],
  withdrawMethods: any[],
  requestTimer: any,
  accountSubscription: any,
  invoicesSubscription: any,
}

export const useWalletStore = defineStore('walletStore', {
  state: (): WalletStateInterface => ({
    accounts: [],
    depositMethods: [],
    withdrawMethods: [],
    requestTimer: '',
    accountSubscription: undefined,
    invoicesSubscription: undefined,
  }),

  getters: {
    activeAccount(state):AccountInterface|undefined {
      return state.accounts.find((acc) => acc.status === 1);
    },

    activeAccountType():string {
      const globalStore = useGlobalStore();
      const { currencies } = storeToRefs(globalStore);

      const activeCurrency = currencies.value.find((currency) => currency.code === this.activeAccount?.currency);
      return activeCurrency?.type || '';
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
      const data = await getDepositMethods(this.activeAccount?.currency || '');
      this.depositMethods = data;
    },

    async getWithdrawMethods():Promise<void> {
      const { getWithdrawMethods } = useCoreWalletApi();
      const data = await getWithdrawMethods(this.activeAccount?.currency || '');
      this.withdrawMethods = data;
    },

    subscribeAccountSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.accountSubscription = createSubscription(`wallet:accounts#${profileStore.profile.id}`, this.updateAccount);
      }
    },

    unsubscribeAccountSocket():void {
      if (this.accountSubscription) {
        this.accountSubscription.unsubscribe();
        this.accountSubscription.removeAllListeners();
      }
    },

    updateAccount(webSocketResponse:WebSocketResponseInterface):void {
      const accountData:AccountInterface|undefined = webSocketResponse.data.account;
      this.accounts = this.accounts.map((account) => {
        if (account.id === accountData?.id) return accountData;
        return account;
      });
    },

    subscribeInvoicesSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.invoicesSubscription = createSubscription(`payment:invoices#${profileStore.profile.id}`, this.showInvoiceStatus);
      }
    },

    showInvoiceStatus(webSocketResponse:WebSocketResponseInterface):void {
      const { formatBalance } = useProjectMethods();
      const { alertsData } = useGlobalStore();
      const { showAlert } = useLayoutStore();
      const invoiceUtcDate = new Date(webSocketResponse.data?.invoice?.createdAt || '');
      const invoiceDate = invoiceUtcDate.toLocaleString().slice(0, 10);
      const eventAmount = webSocketResponse.data?.invoice?.amount;
      const eventCurrency = webSocketResponse.data?.invoice?.currency;
      const formattedSum = formatBalance(eventCurrency, eventAmount);
      const invoiceSuccess = webSocketResponse.data?.invoice?.status === 2;

      const formattedDescription = (cmsMessage: string|undefined):string => {
        if (!cmsMessage) return '';
        const formattedMessage = cmsMessage.replace('{sum}', `${formattedSum.amount} ${formattedSum.currency}`);
        return formattedMessage.replace('{date}', invoiceDate);
      };

      if (webSocketResponse.data?.event === 'invoice.deposit.updated') {
        const cmsMessage = invoiceSuccess ? alertsData?.depositSuccess?.description : alertsData?.depositError?.description;
        const depositSuccessAlertData = alertsData?.depositSuccess ? { ...alertsData.depositSuccess, description: formattedDescription(cmsMessage) } : undefined;
        const depositErrorAlertData = alertsData?.depositError ? { ...alertsData.depositError, description: formattedDescription(cmsMessage) } : undefined;
        showAlert(invoiceSuccess ? depositSuccessAlertData : depositErrorAlertData);
      } else if (webSocketResponse.data?.event === 'invoice.withdrawal.updated') {
        const cmsMessage = invoiceSuccess ? alertsData?.withdrawSuccess?.description : alertsData?.withdrawError?.description;
        const withdrawSuccessAlertData = alertsData?.withdrawSuccess ? { ...alertsData.withdrawSuccess, description: formattedDescription(cmsMessage) } : undefined;
        const withdrawErrorAlertData = alertsData?.withdrawError ? { ...alertsData.withdrawError, description: formattedDescription(cmsMessage) } : undefined;
        showAlert(invoiceSuccess ? withdrawSuccessAlertData : withdrawErrorAlertData);
      }
    },

    unsubscribeInvoiceSocket():void {
      if (this.invoicesSubscription) {
        this.invoicesSubscription.unsubscribe();
        this.invoicesSubscription.removeAllListeners();
      }
    },
  },
});

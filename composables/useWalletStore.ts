import { defineStore, storeToRefs } from 'pinia';
import { AccountInterface, WebSocketResponseInterface } from '@platform/frontend-core/dist/module';
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
    activeAccount(state): Maybe<AccountInterface> {
      return state.accounts.find((acc) => acc.status === 1);
    },

    activeEquivalentAccount(): { balance: number, currency: string, currencySymbol: string } {
      const { getEquivalentAccount } = useProjectMethods();
      return getEquivalentAccount(this.activeAccount?.balance, this.activeAccount?.currency);
    },

    activeAccountType():string {
      const globalStore = useGlobalStore();
      const { currencies } = storeToRefs(globalStore);

      const activeCurrency = currencies.value.find((currency) => currency.code === this.activeAccount?.currency);
      return activeCurrency?.type || '';
    },

    currencyTabs():{ id: string, title: string }[] {
      const globalStore = useGlobalStore();
      const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
      const { getContent } = useProjectMethods();

      return [
        {
          id: 'all',
          title: getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'currency.tabs.allTab') || 'All',
        },
        {
          id: 'crypto',
          title: getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'currency.tabs.cryptoTab') || 'Crypto',
        },
      ];
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

    async switchAccount(accountId: string):Promise<void> {
      const { switchActiveAccount } = useCoreWalletApi();
      const data = await switchActiveAccount(accountId);
      this.accounts = data;
    },

    async hideAccount(accountId: string):Promise<void> {
      const { hideWalletAccount } = useCoreWalletApi();
      const data = await hideWalletAccount(accountId);
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
      const accountData: Maybe<AccountInterface> = webSocketResponse.data.account;
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
      const { formatBalance, getContent } = useProjectMethods();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
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
        const { getDepositBonusCode } = useBonusStore();
        getDepositBonusCode();

        const cmsMessage = invoiceSuccess
            ? getContent(alertsData, defaultLocaleAlertsData, 'depositSuccess.description')
            : getContent(alertsData, defaultLocaleAlertsData, 'depositError.description');

        const depositSuccessObj = alertsData?.depositSuccess || defaultLocaleAlertsData?.depositSuccess;
        const depositErrorObj = alertsData?.depositError || defaultLocaleAlertsData?.depositError;

        const depositSuccessAlertData = depositSuccessObj ? { ...depositSuccessObj, description: formattedDescription(cmsMessage) } : undefined;
        const depositErrorAlertData = depositErrorObj ? { ...depositErrorObj, description: formattedDescription(cmsMessage) } : undefined;
        showAlert(invoiceSuccess ? depositSuccessAlertData : depositErrorAlertData);
      } else if (webSocketResponse.data?.event === 'invoice.withdrawal.updated') {
        const cmsMessage = invoiceSuccess
            ? getContent(alertsData, defaultLocaleAlertsData, 'withdrawSuccess.description')
            : getContent(alertsData, defaultLocaleAlertsData, 'withdrawError.description');

        const withdrawSuccessObj = alertsData?.withdrawSuccess || defaultLocaleAlertsData?.withdrawSuccess;
        const withdrawErrorObj = alertsData?.withdrawError || defaultLocaleAlertsData?.withdrawError;

        const withdrawSuccessAlertData = withdrawSuccessObj ? { ...withdrawSuccessObj, description: formattedDescription(cmsMessage) } : undefined;
        const withdrawErrorAlertData = withdrawErrorObj ? { ...withdrawErrorObj, description: formattedDescription(cmsMessage) } : undefined;
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

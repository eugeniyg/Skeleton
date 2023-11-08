import { defineStore, storeToRefs } from 'pinia';
import type { IAccount,IWebSocketResponse } from '@skeleton/core/types';

interface IWalletState {
  accounts: IAccount[];
  depositMethods: any[];
  withdrawMethods: any[];
  requestTimer: any;
  accountSubscription: any;
  invoicesSubscription: any;
  depositLimitError: boolean;
}

export const useWalletStore = defineStore('walletStore', {
  state: (): IWalletState => ({
    accounts: [],
    depositMethods: [],
    withdrawMethods: [],
    requestTimer: '',
    accountSubscription: undefined,
    invoicesSubscription: undefined,
    depositLimitError: false
  }),

  getters: {
    activeAccount(state): Maybe<IAccount> {
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
          title: getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'currencyPopup.tabs.allTab') || 'All',
        },
        {
          id: 'crypto',
          title: getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'currencyPopup.tabs.cryptoTab') || 'Crypto',
        },
      ];
    },

    showEquivalentBalance(): boolean {
      const globalStore = useGlobalStore();
      return !!globalStore.equivalentCurrency && this.activeAccountType === 'crypto';
    }
  },

  actions: {
    async getUserAccounts():Promise<void> {
      const { getAccounts } = useCoreWalletApi();
      this.accounts = await getAccounts();
    },

    async createAccount(currency: string):Promise<void> {
      const { addAccount } = useCoreWalletApi();
      this.accounts = await addAccount(currency);
    },

    async switchAccount(accountId: string):Promise<void> {
      const { switchActiveAccount } = useCoreWalletApi();
      this.accounts = await switchActiveAccount(accountId);
    },

    async hideAccount(accountId: string):Promise<void> {
      const { hideWalletAccount } = useCoreWalletApi();
      this.accounts = await hideWalletAccount(accountId);
    },

    async getDepositMethods():Promise<void> {
      this.depositLimitError = false;
      const { getDepositMethods } = useCoreWalletApi();

      try {
        this.depositMethods = await getDepositMethods(this.activeAccount?.currency || '');
      } catch (err: any) {
        this.depositMethods = [];

        if (err.data?.error?.code === 13100) {
          this.depositLimitError = true;
          const { getLimits } = useLimitsStore();
          await getLimits();
        }
      }
    },

    async getWithdrawMethods():Promise<void> {
      const { getWithdrawMethods } = useCoreWalletApi();
      this.withdrawMethods = await getWithdrawMethods(this.activeAccount?.currency || '');
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

    updateAccount(webSocketResponse:IWebSocketResponse):void {
      const accountData: Maybe<IAccount> = webSocketResponse.data.account;
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

    showInvoiceStatus(webSocketResponse:IWebSocketResponse):void {
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
            ? getContent(alertsData, defaultLocaleAlertsData, 'wallet.depositSuccess.description')
            : getContent(alertsData, defaultLocaleAlertsData, 'wallet.depositError.description');

        const depositSuccessObj = alertsData?.wallet?.depositSuccess || defaultLocaleAlertsData?.wallet?.depositSuccess;
        const depositErrorObj = alertsData?.wallet?.depositError || defaultLocaleAlertsData?.wallet?.depositError;

        const depositSuccessAlertData = depositSuccessObj ? { ...depositSuccessObj, description: formattedDescription(cmsMessage) } : undefined;
        const depositErrorAlertData = depositErrorObj ? { ...depositErrorObj, description: formattedDescription(cmsMessage) } : undefined;
        showAlert(invoiceSuccess ? depositSuccessAlertData : depositErrorAlertData);
      } else if (webSocketResponse.data?.event === 'invoice.withdrawal.updated') {
        const cmsMessage = invoiceSuccess
            ? getContent(alertsData, defaultLocaleAlertsData, 'wallet.withdrawSuccess.description')
            : getContent(alertsData, defaultLocaleAlertsData, 'wallet.withdrawError.description');

        const withdrawSuccessObj = alertsData?.wallet?.withdrawSuccess || defaultLocaleAlertsData?.wallet?.withdrawSuccess;
        const withdrawErrorObj = alertsData?.wallet?.withdrawError || defaultLocaleAlertsData?.wallet?.withdrawError;

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

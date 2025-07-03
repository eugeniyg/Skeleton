import { defineStore, storeToRefs } from 'pinia';
import type { IAccount, IInvoiceStatistics, ISocketInvoice, IWebSocketResponse } from '@skeleton/core/types';

interface IWalletState {
  accounts: IAccount[];
  depositMethods: any[];
  withdrawMethods: any[];
  requestTimer: any;
  accountSubscription: any;
  invoicesSubscription: any;
  depositLimitError: boolean;
  accountSwitching: Promise<any> | undefined;
  requestPaymentMethodsRegion: Maybe<string>;
  selectedPaymentMethodsRegion: Maybe<string>;
  invoicesStatistics: IInvoiceStatistics[] | undefined;
  paymentStatisticsLoading: Promise<any> | undefined;
}

export const useWalletStore = defineStore('walletStore', {
  state: (): IWalletState => ({
    accounts: [],
    depositMethods: [],
    withdrawMethods: [],
    requestTimer: '',
    accountSubscription: undefined,
    invoicesSubscription: undefined,
    depositLimitError: false,
    accountSwitching: undefined,
    requestPaymentMethodsRegion: undefined,
    selectedPaymentMethodsRegion: undefined,
    invoicesStatistics: undefined,
    paymentStatisticsLoading: undefined,
  }),

  getters: {
    activeAccount(state): Maybe<IAccount> {
      return state.accounts.find(acc => acc.status === 1);
    },

    activeEquivalentAccount(): { balance: number; currency: string; currencySymbol: string } {
      const { getEquivalentAccount } = useProjectMethods();
      return getEquivalentAccount(this.activeAccount?.balance, this.activeAccount?.currency);
    },

    activeAccountType(): string {
      const globalStore = useGlobalStore();
      const { currencies } = storeToRefs(globalStore);

      const activeCurrency = currencies.value.find(currency => currency.code === this.activeAccount?.currency);
      return activeCurrency?.type || '';
    },

    currencyTabs(): { id: string; title: string }[] {
      const globalStore = useGlobalStore();
      const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
      const { getContent } = useProjectMethods();

      return [
        {
          id: 'all',
          title:
            getContent(
              globalComponentsContent.value,
              defaultLocaleGlobalComponentsContent.value,
              'currencyPopup.tabs.allTab'
            ) || 'All',
        },
        {
          id: 'crypto',
          title:
            getContent(
              globalComponentsContent.value,
              defaultLocaleGlobalComponentsContent.value,
              'currencyPopup.tabs.cryptoTab'
            ) || 'Crypto',
        },
      ];
    },

    showEquivalentBalance(): boolean {
      const globalStore = useGlobalStore();
      return !!globalStore.equivalentCurrency && this.activeAccountType === 'crypto';
    },

    totalBaseCurrencyDepositAmount(): string | undefined {
      if (!this.invoicesStatistics) return undefined;
      const totalAmount = this.invoicesStatistics.reduce((totalAmount, currentCurrencyItemStatistic) => {
        return totalAmount + (currentCurrencyItemStatistic.depositsSumBaseCurrency ?? 0);
      }, 0);

      const { baseCurrency } = useGlobalStore();
      return `${totalAmount} ${baseCurrency?.code}`;
    },
  },

  actions: {
    async getPaymentStatistics(): Promise<void> {
      const { getInvoicesStatistics } = useCoreWalletApi();
      try {
        this.paymentStatisticsLoading = getInvoicesStatistics();
        this.invoicesStatistics = await this.paymentStatisticsLoading;
        this.paymentStatisticsLoading = undefined;
      } catch {
        this.invoicesStatistics = undefined;
      }
    },

    async getUserAccounts(): Promise<void> {
      const { getAccounts } = useCoreWalletApi();
      this.accounts = await getAccounts();
    },

    async createAccount(currency: string): Promise<void> {
      const { addAccount } = useCoreWalletApi();
      this.accounts = await addAccount(currency);
    },

    async switchAccount(accountId: string): Promise<void> {
      const { switchActiveAccount } = useCoreWalletApi();
      this.accountSwitching = switchActiveAccount(accountId);
      this.accounts = await this.accountSwitching;
      this.accountSwitching = undefined;
      useEvent('accountChanged');

      const runtimeConfig = useRuntimeConfig();
      if (runtimeConfig.public?.questsEnabled) {
        const { getActiveQuests } = useQuestsStore();
        getActiveQuests();
      }

      const { getPlayerBonuses, getPlayerFreeSpins, getPlayerCashback, getDepositBonuses } = useBonusStore();

      getPlayerBonuses();
      getPlayerFreeSpins();
      getPlayerCashback();
      getDepositBonuses();
    },

    async hideAccount(accountId: string): Promise<void> {
      const { hideWalletAccount } = useCoreWalletApi();
      this.accounts = await hideWalletAccount(accountId);
    },

    setPaymentMethodsGeo(): void {
      const storageGeo = localStorage.getItem('paymentGeo');
      const globalStore = useGlobalStore();
      const programmaticGeo = storageGeo || globalStore.headerCountry;

      if (!programmaticGeo) this.selectedPaymentMethodsRegion = undefined;
      else {
        const globalStore = useGlobalStore();
        this.selectedPaymentMethodsRegion = globalStore.countries?.find(
          country => country.code === programmaticGeo
        )?.code;
      }

      this.requestPaymentMethodsRegion =
        this.selectedPaymentMethodsRegion !== globalStore.headerCountry ? this.selectedPaymentMethodsRegion : undefined;
    },

    async getDepositMethods(): Promise<void> {
      this.depositLimitError = false;
      const { getDepositMethods } = useCoreWalletApi();

      try {
        this.depositMethods = await getDepositMethods(
          this.activeAccount?.currency || '',
          this.requestPaymentMethodsRegion
        );
      } catch (err: any) {
        this.depositMethods = [];

        if (err.data?.error?.code === 13100) {
          this.depositLimitError = true;
          const { getLimits } = useLimitsStore();
          await getLimits();
        }
      }
    },

    async getWithdrawMethods(): Promise<void> {
      const { getWithdrawMethods } = useCoreWalletApi();
      this.withdrawMethods = await getWithdrawMethods(
        this.activeAccount?.currency || '',
        this.requestPaymentMethodsRegion
      );
    },

    subscribeAccountSocket(): void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.accountSubscription = createSubscription(
          `wallet:accounts#${profileStore.profile?.id}`,
          this.updateAccount
        );
      }
    },

    unsubscribeAccountSocket(): void {
      if (this.accountSubscription) {
        this.accountSubscription.unsubscribe();
        this.accountSubscription.removeAllListeners();
      }
    },

    updateAccount(webSocketResponse: IWebSocketResponse): void {
      const accountData: Maybe<IAccount> = webSocketResponse.data.account;
      this.accounts = this.accounts.map(account => {
        if (account.id === accountData?.id) return accountData;
        return account;
      });
    },

    subscribeInvoicesSocket(): void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.invoicesSubscription = createSubscription(
          `payment:invoices#${profileStore.profile?.id}`,
          this.showInvoiceStatus
        );
      }
    },

    asyncInvoiceProcessing(invoiceData: ISocketInvoice | undefined): void {
      if (!invoiceData || invoiceData.status !== 1 || !invoiceData.publicData) return;

      const sessionInvoice = sessionStorage.getItem('asyncInvoiceId');
      if (sessionInvoice && sessionInvoice === invoiceData.id) {
        const showAwaitInvoiceBlock = document.getElementById('wallet-await-invoice');
        if (showAwaitInvoiceBlock && invoiceData.publicData.qr) useEvent('receivedAsyncInvoice', invoiceData);
        sessionStorage.removeItem('asyncInvoiceId');
      }
    },

    showInvoiceStatus(webSocketResponse: IWebSocketResponse): void {
      const socketInvoiceData = webSocketResponse.data?.invoice;
      this.asyncInvoiceProcessing(socketInvoiceData);
      if (![2, 3].includes(socketInvoiceData?.status || -1)) return;

      const { formatBalance, getContent } = useProjectMethods();
      const { alertsData, defaultLocaleAlertsData, currencies } = useGlobalStore();
      const { showAlert } = useLayoutStore();
      const invoiceUtcDate = new Date(socketInvoiceData?.createdAt || '');
      const invoiceDate = invoiceUtcDate.toLocaleString().slice(0, 10);
      const eventAmount = socketInvoiceData?.amount;
      const eventCurrency = socketInvoiceData?.currency;
      const formattedSum = formatBalance(eventCurrency, eventAmount);
      const invoiceSuccess = socketInvoiceData?.status === 2;
      const eventCurrencyObject = currencies.find(currency => currency.code === eventCurrency);

      const formattedDescription = (cmsMessage: string | undefined): string => {
        if (!cmsMessage) return '';
        const formattedMessage = cmsMessage.replace('{sum}', `${formattedSum.amount} ${formattedSum.currency}`);
        return formattedMessage.replace('{date}', invoiceDate);
      };

      if (webSocketResponse.data?.event === 'invoice.deposit.updated') {
        const { getDepositBonusCode, getDepositBonuses } = useBonusStore();
        getDepositBonusCode();
        getDepositBonuses();
        this.getPaymentStatistics();
        useEvent('depositInvoiceUpdated');

        const cmsMessage = invoiceSuccess
          ? getContent(alertsData, defaultLocaleAlertsData, 'wallet.depositSuccess.description')
          : getContent(alertsData, defaultLocaleAlertsData, 'wallet.depositError.description');

        const depositSuccessObj = alertsData?.wallet?.depositSuccess || defaultLocaleAlertsData?.wallet?.depositSuccess;
        const depositErrorObj = alertsData?.wallet?.depositError || defaultLocaleAlertsData?.wallet?.depositError;
        const description = formattedDescription(cmsMessage);

        const depositSuccessAlertData = depositSuccessObj ? { ...depositSuccessObj, description } : undefined;
        const depositErrorAlertData = depositErrorObj ? { ...depositErrorObj, description } : undefined;
        showAlert(invoiceSuccess ? depositSuccessAlertData : depositErrorAlertData);

        useEvent('analyticsEvent', {
          event: invoiceSuccess ? 'walletDepositSuccess' : 'walletDepositFail',
          depositAmount: eventAmount,
          depositCurrency: eventCurrency,
          successDepositNumber: socketInvoiceData?.number,
          invoiceId: socketInvoiceData?.id,
          walletType: eventCurrencyObject?.type,
        });
      } else if (webSocketResponse.data?.event === 'invoice.withdrawal.updated') {
        const cmsMessage = invoiceSuccess
          ? getContent(alertsData, defaultLocaleAlertsData, 'wallet.withdrawSuccess.description')
          : getContent(alertsData, defaultLocaleAlertsData, 'wallet.withdrawError.description');

        const withdrawSuccessObj =
          alertsData?.wallet?.withdrawSuccess || defaultLocaleAlertsData?.wallet?.withdrawSuccess;
        const withdrawErrorObj = alertsData?.wallet?.withdrawError || defaultLocaleAlertsData?.wallet?.withdrawError;
        const description = formattedDescription(cmsMessage);

        const withdrawSuccessAlertData = withdrawSuccessObj ? { ...withdrawSuccessObj, description } : undefined;
        const withdrawErrorAlertData = withdrawErrorObj ? { ...withdrawErrorObj, description } : undefined;
        showAlert(invoiceSuccess ? withdrawSuccessAlertData : withdrawErrorAlertData);

        useEvent('analyticsEvent', {
          event: invoiceSuccess ? 'walletWithdrawSuccess' : 'walletWithdrawFail',
          withdrawAmount: eventAmount,
          withdrawCurrency: eventCurrency,
          invoiceId: socketInvoiceData?.id,
          walletType: eventCurrencyObject?.type,
        });
      }
    },

    unsubscribeInvoiceSocket(): void {
      if (this.invoicesSubscription) {
        this.invoicesSubscription.unsubscribe();
        this.invoicesSubscription.removeAllListeners();
      }
    },
  },
});

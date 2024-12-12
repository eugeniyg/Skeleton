import { defineStore } from 'pinia';
import { useModal, type UseModalReturnType } from 'vue-final-modal';
import { defineAsyncComponent } from 'vue';
import type { Dayjs } from 'dayjs';

type WalletModalTypes = 'deposit' | 'withdraw' | undefined;

interface IModals extends Record<string, Maybe<UseModalReturnType<any>>> {
  'sign-in': Maybe<UseModalReturnType<any>>;
  'forgot-pass': Maybe<UseModalReturnType<any>>;
  'reset-pass': Maybe<UseModalReturnType<any>>;
  'sign-up': Maybe<UseModalReturnType<any>>;
  'sign-up-cancel': Maybe<UseModalReturnType<any>>;
  'deposit-error': Maybe<UseModalReturnType<any>>;
  'deposit-success': Maybe<UseModalReturnType<any>>;
  'deposit-pending': Maybe<UseModalReturnType<any>>;
  wallet: Maybe<UseModalReturnType<any>>;
  'cancel-deposit': Maybe<UseModalReturnType<any>>;
  'profile-confirmed': Maybe<UseModalReturnType<any>>;
  'mobile-game': Maybe<UseModalReturnType<any>>;
  'equivalent-currency': Maybe<UseModalReturnType<any>>;
}

interface IModalStoreState {
  modals: IModals;
  modalsUrl: string[];
  onlyGuestModals: string[];
  onlyLoggedModals: string[];
  openingModals: string[];
  sameComponent: Record<string, string>;
  walletModalType: WalletModalTypes;
  walletOpening: boolean;
}

export const useModalStore = defineStore('modalStore', {
  state: (): IModalStoreState => ({
    modals: {
      'sign-in': undefined,
      'forgot-pass': undefined,
      'reset-pass': undefined,
      'sign-up': undefined,
      'sign-up-cancel': undefined,
      'deposit-error': undefined,
      'deposit-success': undefined,
      'deposit-pending': undefined,
      wallet: undefined,
      'cancel-deposit': undefined,
      'profile-confirmed': undefined,
      'mobile-game': undefined,
      'equivalent-currency': undefined,
    },
    modalsUrl: [
      'sign-in',
      'forgot-pass',
      'reset-pass',
      'sign-up',
      'deposit-error',
      'deposit-success',
      'deposit-pending',
      'wallet',
      'profile-confirmed',
    ],
    onlyGuestModals: ['sign-in', 'sign-up', 'forgot-pass', 'reset-pass'],
    onlyLoggedModals: ['wallet', 'deposit-success', 'deposit-error', 'deposit-pending', 'equivalent-currency'],
    openingModals: [],
    sameComponent: {
      'deposit-pending': 'success',
      'deposit-success': 'success',
    },
    walletModalType: undefined,
    walletOpening: false,
  }),

  actions: {
    accessToOpen(modalName: string): boolean {
      const { isLoggedIn } = useProfileStore();
      if (this.onlyGuestModals.includes(modalName)) return !isLoggedIn;
      if (this.onlyLoggedModals.includes(modalName)) return isLoggedIn;
      return true;
    },

    async addModalQuery(modalName: string, modalQueryParam?: string): Promise<void> {
      const router = useRouter();
      const { query } = useRoute();
      const newQuery = { ...query };
      Object.keys(query).forEach(queryName => {
        if (this.modalsUrl.includes(queryName)) {
          if (this.modals[queryName]) this.modals[queryName].close();
          delete newQuery[queryName];
        }
      });
      await router.replace({ query: { ...newQuery, [modalName]: modalQueryParam || 'true' } });
    },

    async removeModalQuery(modalName: string): Promise<void> {
      const router = useRouter();
      const { query } = useRoute();
      const newQuery = { ...query, [modalName]: undefined };
      if (modalName === 'reset-pass') newQuery.resetCode = undefined;
      await router.replace({ query: newQuery });
    },

    async openModal(modalName: string, modalQueryParam?: string, prohibitQueryChange = true): Promise<void> {
      if (!this.accessToOpen(modalName) || this.openingModals.includes(modalName)) return;
      this.openingModals.push(modalName);

      if (!this.modals[modalName]) {
        const modalComponentName = this.sameComponent[modalName] || modalName;
        const modalComponent = defineAsyncComponent(async () => {
          try {
            return await import(`../../components/modal/${modalComponentName}.vue`);
          } catch {
            return import(`../components/modal/${modalComponentName}.vue`);
          }
        });
        const contentParams = {
          contentKey: `modal-${modalName}`,
          contentRoute: ['modals', modalName],
        };
        const { getContentData } = useContentLogic(contentParams);
        const { currentLocaleData, defaultLocaleData } = await getContentData();

        this.modals[modalName] = useModal({
          component: modalComponent,
          attrs: {
            currentLocaleData,
            defaultLocaleData,
          },
        });
      }

      if (prohibitQueryChange && this.modalsUrl.includes(modalName))
        await this.addModalQuery(modalName, modalQueryParam);
      this.modals[modalName].open();
      this.openingModals = this.openingModals.filter(item => item !== modalName);
    },

    async closeModal(modalName: string): Promise<void> {
      this.modals[modalName]?.close();
      if (this.modalsUrl.includes(modalName)) await this.removeModalQuery(modalName);
    },

    async closeAllModals(): Promise<void> {
      const { query } = useRoute();
      const newQuery = { ...query };
      Object.keys(query).forEach(queryName => {
        if (this.modalsUrl.includes(queryName)) delete newQuery[queryName];
      });

      // CAN'T USE "vfm.closeAll()" BECAUSE OF SKELETON AND PROJECTS MODALS
      Object.keys(this.modals).forEach(modalName => this.modals[modalName]?.close());
      const router = useRouter();
      await router.replace({ query: newQuery });
    },

    async checkOpenedModals(): Promise<void> {
      const route = useRoute();
      const queryArr = Object.keys(route.query);

      for (const queryName of queryArr) {
        if (!this.modalsUrl.includes(queryName)) return;

        if (!this.accessToOpen(queryName)) {
          await this.removeModalQuery(queryName);
        } else if (queryName === 'wallet') {
          const queryParam = route.query[queryName] as string;
          const modalType = ['deposit', 'withdraw'].includes(queryParam) ? (queryParam as WalletModalTypes) : undefined;
          await this.openWalletModal(modalType);
          break;
        } else {
          await this.openModal(queryName, route.query[queryName] as string);
          break;
        }
      }
    },

    async openWalletModal(modalType?: WalletModalTypes): Promise<void> {
      if (!this.accessToOpen('wallet') || this.walletOpening) return;
      this.walletOpening = true;

      const dayjs = useDayjs();
      const startModalLoad: Dayjs = dayjs();

      this.walletModalType = modalType;
      const { setPaymentMethodsGeo, getDepositMethods, getWithdrawMethods, accountSwitching } = useWalletStore();
      const { getDepositBonuses, getDepositBonusCode } = useBonusStore();
      const riskStore = useRiskStore();
      setPaymentMethodsGeo();
      await accountSwitching;
      await Promise.allSettled([
        getDepositMethods(),
        getWithdrawMethods(),
        getDepositBonuses(),
        getDepositBonusCode(),
        riskStore.getTurnOverWager(),
      ]);

      const { isLoggedIn } = useProfileStore();
      if (!isLoggedIn) {
        this.walletOpening = false;
        return;
      }

      const runtimeConfig = useRuntimeConfig();
      const showTurnOverWagerModal =
        runtimeConfig.public.enableTurnOverWager &&
        modalType === 'withdraw' &&
        riskStore.turnOverWagerData?.turnOverWagerAmount > 0;

      if (showTurnOverWagerModal) {
        const { showModal } = useLayoutStore();
        showModal('turnOverWager');
        this.walletOpening = false;
        return;
      }

      await this.openModal('wallet', modalType);
      useEvent('analyticsEvent', {
        event: 'walletOpen',
        loadTime: dayjs().diff(startModalLoad),
      });

      this.walletOpening = false;
    },
  },
});

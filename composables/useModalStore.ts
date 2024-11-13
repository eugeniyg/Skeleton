import { defineStore } from 'pinia';
import { useVfm, useModal, type UseModalReturnType } from 'vue-final-modal';
import { defineAsyncComponent } from 'vue';

interface IModals extends Record<string, Maybe<UseModalReturnType<any>>> {
  'sign-in': Maybe<UseModalReturnType<any>>;
  'forgot-pass': Maybe<UseModalReturnType<any>>;
  'reset-pass': Maybe<UseModalReturnType<any>>;
  'sign-up': Maybe<UseModalReturnType<any>>;
  'sign-up-cancel': Maybe<UseModalReturnType<any>>;
  failing: Maybe<UseModalReturnType<any>>;
  'success-deposit': Maybe<UseModalReturnType<any>>;
  'deposit-pending': Maybe<UseModalReturnType<any>>;
}

interface IModalStoreState {
  modals: IModals;
  modalsUrl: string[];
  onlyGuestModals: string[];
  onlyLoggedModals: string[];
  openingModals: string[];
  sameComponent: Record<string, string>;
}

export const useModalStore = defineStore('modalStore', {
  state: (): IModalStoreState => ({
    modals: {
      'sign-in': undefined,
      'forgot-pass': undefined,
      'reset-pass': undefined,
      'sign-up': undefined,
      'sign-up-cancel': undefined,
      failing: undefined,
      'success-deposit': undefined,
      'deposit-pending': undefined,
    },
    modalsUrl: ['sign-in', 'forgot-pass', 'reset-pass', 'sign-up', 'failing', 'success-deposit', 'deposit-pending'],
    onlyGuestModals: ['sign-in', 'sign-up', 'forgot-pass', 'reset-pass'],
    onlyLoggedModals: [],
    openingModals: [],
    sameComponent: {
      'deposit-pending': 'success',
      'success-deposit': 'success',
    },
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
        const modalComponent = defineAsyncComponent(
          () => import(`../components/modal/${this.sameComponent[modalName] || modalName}.vue`)
        );
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

      if (prohibitQueryChange && this.modalsUrl.includes(modalName)) this.addModalQuery(modalName, modalQueryParam);
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

      const vfm = useVfm();
      const router = useRouter();
      await Promise.all([router.replace({ query: newQuery }), vfm.closeAll()]);
    },

    async checkOpenedModals(): Promise<void> {
      const { query } = useRoute();
      const queryArr = Object.keys(query);

      for (const queryName of queryArr) {
        if (!this.modalsUrl.includes(queryName)) return;

        if (!this.accessToOpen(queryName)) {
          await this.removeModalQuery(queryName);
        } else if (queryName === 'wallet') {
          //
        } else {
          await this.openModal(queryName, query[queryName] as string);
          break;
        }
      }
    },
  },
});

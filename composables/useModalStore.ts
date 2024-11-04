import {defineStore} from "pinia";
import {useVfm, useModal, type UseModalReturnType } from 'vue-final-modal';
import { defineAsyncComponent } from "vue";

interface IModals extends Record<string, Maybe<UseModalReturnType<any>>> {
  'sign-in': Maybe<UseModalReturnType<any>>;
  'forgot-pass':Maybe<UseModalReturnType<any>>;
  'reset-pass': Maybe<UseModalReturnType<any>>;
  'sign-up': Maybe<UseModalReturnType<any>>;
  'sign-up-cancel': Maybe<UseModalReturnType<any>>;
}

interface IModalStoreState {
  modals: IModals;
  modalsUrl: string[];
  onlyGuestModals: string[];
  onlyLoggedModals: string[];
}

export const useModalStore = defineStore('modalStore', {
  state: ():IModalStoreState => ({
    modals: {
      'sign-in': undefined,
      'forgot-pass': undefined,
      'reset-pass': undefined,
      'sign-up': undefined,
      'sign-up-cancel': undefined
    },
    modalsUrl: ['sign-in', 'forgot-pass', 'reset-pass', 'sign-up'],
    onlyGuestModals: ['sign-in', 'sign-up', 'forgot-pass', 'reset-pass'],
    onlyLoggedModals: []
  }),

  actions: {
    accessToOpen(modalName: string): boolean {
      const { isLoggedIn } = useProfileStore();
      if (this.onlyGuestModals.includes(modalName)) return !isLoggedIn;
      if (this.onlyLoggedModals.includes(modalName)) return isLoggedIn;
      return true;
    },

    addModalQuery(modalName: string, modalQueryParam?: string): void {
      const router = useRouter();
      const { query } = useRoute();
      const newQuery = { ...query };
      Object.keys(query).forEach(queryName => {
        if (this.modalsUrl.includes(queryName)) {
          if (this.modals[queryName]) this.modals[queryName].close();
          delete newQuery[queryName];
        }
      });
      router.replace({ query: { ...newQuery, [modalName]: modalQueryParam || 'true' } });
    },

    removeModalQuery(modalName:string):void {
      const router = useRouter();
      const { query } = useRoute();
      const newQuery = { ...query, [modalName]: undefined };
      if (modalName === 'reset-pass') newQuery.resetCode = undefined;
      router.replace({ query: newQuery });
    },

    async openModal(modalName: string, modalQueryParam?: string, prohibitQueryChange = true): Promise<void> {
      if (!this.accessToOpen(modalName)) return;

      if (!this.modals[modalName]) {
        const modalComponent = defineAsyncComponent(() => import(`../components/modal/${modalName}.vue`));
        const contentParams = {
          contentKey: `modal-${modalName}`,
          contentRoute: ['modals', modalName]
        };
        const { getContentData } = useContentLogic(contentParams);
        const { currentLocaleData, defaultLocaleData } = await getContentData();

        this.modals[modalName] = useModal({
          component: modalComponent,
          attrs: {
            currentLocaleData,
            defaultLocaleData
          }
        })
      }

      if (prohibitQueryChange && this.modalsUrl.includes(modalName)) this.addModalQuery(modalName, modalQueryParam);
      this.modals[modalName].open();
    },

    closeModal(modalName: string):void {
      this.modals[modalName]?.close();
      if (this.modalsUrl.includes(modalName)) this.removeModalQuery(modalName);
    },

    async closeAllModals(): Promise<void> {
      const { query } = useRoute();
      const newQuery = { ...query };
      Object.keys(query).forEach(queryName => {
        if (this.modalsUrl.includes(queryName)) delete newQuery[queryName];
      });
      const router = useRouter();
      router.replace({ query: newQuery });

      const vfm = useVfm();
      await vfm.closeAll();
    },

    checkOpenedModals():void {
      const { query } = useRoute();
      const queryArr = Object.keys(query);

      for (const queryName of queryArr) {
        if (!this.modalsUrl.includes(queryName)) return;

        if (!this.accessToOpen(queryName)) {
          this.removeModalQuery(queryName);
        } else if (queryName === 'wallet') {
          //
        } else {
          this.openModal(queryName, query[queryName] as string);
          break;
        }
      }
    }
  },
});
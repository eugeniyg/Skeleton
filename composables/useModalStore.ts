import {defineStore} from "pinia";
import { useModal } from 'vue-final-modal';
import type { Vfm } from 'vue-final-modal';
import { defineAsyncComponent } from "vue";

interface IModals extends Record<string, any> {
  'sign-in': Maybe<Vfm>;
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
      'sign-in': undefined
    },
    modalsUrl: ['sign-in'],
    onlyGuestModals: ['sign-in'],
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
      router.replace({ query: { ...query, [modalName]: modalQueryParam || 'true' } });
    },

    removeModalQuery(modalName:string):void {
      const router = useRouter();
      const { query } = useRoute();
      router.replace({ query: { ...query, [modalName]: undefined } });
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
      this.modals[modalName].close();
      if (this.modalsUrl.includes(modalName)) this.removeModalQuery(modalName);
    },

    checkOpenedModals():void {
      const { query } = useRoute();
      const queryArr = Object.keys(query);

      queryArr.forEach((queryName) => {
        if (!this.modalsUrl.includes(queryName)) return;

        if (!this.accessToOpen(queryName)) {
          this.removeModalQuery(queryName);
        } else if (queryName === 'wallet') {
          //
        } else {
          this.openModal(queryName, query[queryName] as string);
        }
      });
    }
  },
});
import {defineStore} from "pinia";
import { useModal } from 'vue-final-modal';
import type { Vfm } from 'vue-final-modal';
import { defineAsyncComponent } from "vue";

interface IModals extends Record<string, any> {
  login: Maybe<Vfm>;
}

interface IModalsUrl {
  login: string;
}

interface IModalStoreState {
  modals: IModals;
  modalsUrl: IModalsUrl;
}

export const useModalStore = defineStore('modalStore', {
  state: ():IModalStoreState => ({
    modals: {
      login: undefined
    },
    modalsUrl: {
      login: 'sign-in',
    },
  }),

  actions: {
    async openModal(modalName: string): Promise<void> {
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

      this.modals[modalName].open();
    },

    closeModal(modalName: string):void {
      this.modals[modalName].close();
    },
  },
});
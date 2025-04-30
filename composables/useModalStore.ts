import { defineStore } from 'pinia';
import camelCase from 'lodash/camelCase';
import { useModal, type UseModalReturnType } from 'vue-final-modal';
import { defineAsyncComponent } from 'vue';
import type { Dayjs } from 'dayjs';
import modalsMap from '@skeleton/maps/modalsMap.json';
import type { IModalSettings } from '@skeleton/types';
import { ModalSignIn, ModalSignUp, ModalWallet, ModalGeoRestrictedType } from '#components';

type WalletModalTypes = 'deposit' | 'withdraw' | undefined;

interface IModalStoreState {
  modalsList: Record<string, IModalSettings>;
  modals: { [key: string]: Maybe<UseModalReturnType<any>> };
  openingModals: string[];
  walletModalType: WalletModalTypes;
  walletOpening: boolean;
}

interface IOpenModalParams {
  prohibitQueryChange?: boolean;
  modalQueryValue?: string;
  props?: Record<string, any>;
}

export const useModalStore = defineStore('modalStore', {
  state: (): IModalStoreState => ({
    modalsList: modalsMap,
    modals: {},
    openingModals: [],
    walletModalType: undefined,
    walletOpening: false,
  }),

  actions: {
    accessToOpen(modalName: string): boolean {
      const { isLoggedIn } = useProfileStore();
      if (this.modalsList[modalName]?.onlyGuest) return !isLoggedIn;
      if (this.modalsList[modalName]?.onlyLogged) return isLoggedIn;
      return true;
    },

    async addModalQuery(modalName: string, modalQueryParam?: string): Promise<void> {
      const router = useRouter();
      const { query } = useRoute();
      const newQuery = { ...query };

      Object.keys(this.modals).forEach(modalName => {
        const modalListQueryName: string | undefined = this.modalsList[modalName]?.queryName;
        if (
          modalListQueryName &&
          this.modals[modalName]?.options?.modelValue &&
          query.hasOwnProperty(modalListQueryName)
        ) {
          this.modals[modalName].close();
          delete newQuery[modalListQueryName];
        }
      });

      await router.replace({
        query: { ...newQuery, [this.modalsList[modalName]?.queryName as string]: modalQueryParam || 'true' },
      });
    },

    async removeModalQuery(modalName: string): Promise<void> {
      const modalListQueryName: string | undefined = this.modalsList[modalName]?.queryName;
      if (!modalListQueryName) return;

      const router = useRouter();
      const { query } = useRoute();
      const newQuery = { ...query, [modalListQueryName]: undefined };
      if (modalName === 'reset-pass') newQuery.resetCode = undefined;
      await router.replace({ query: newQuery });
    },

    isRestricted() {
      const { countries, headerCountry } = useGlobalStore();

      if (!headerCountry) return undefined;
      const currentCountryObj = countries.find(country => country.code === headerCountry.toUpperCase());

      console.log(currentCountryObj?.restrict,  currentCountryObj?.restrictType);

      return currentCountryObj?.restrict &&  currentCountryObj?.restrictType === 2;
    },

    async openModal(modalName: string, params?: IOpenModalParams): Promise<void> {
      if (!this.modalsList[modalName] || !this.accessToOpen(modalName) || this.openingModals.includes(modalName))
        return;

      if (['sign-in', 'sign-up'].includes(modalName) && this.isRestricted()) {
        modalName = 'geo-restricted-type';
      }

      this.openingModals.push(modalName);

      if (!this.modals[modalName]) {
        let modalComponent: any;
        if (modalName === 'sign-in') modalComponent = ModalSignIn;
        else if (modalName === 'sign-up') modalComponent = ModalSignUp;
        else if (modalName === 'wallet') modalComponent = ModalWallet;
        else if (modalName === 'geo-restricted-type') modalComponent = ModalGeoRestrictedType;
        else {
          const modalComponentName = this.modalsList[modalName].component;
          const customModals = import.meta.glob(`../../components/modal/*.vue`);
          const hasCustomModal = !!customModals[`../../components/modal/${modalComponentName}.vue`];
          modalComponent = hasCustomModal
            ? defineAsyncComponent(() => import(`../../components/modal/${modalComponentName}.vue`))
            : defineAsyncComponent(() => import(`../components/modal/${modalComponentName}.vue`));
        }

        if (this.modalsList[modalName].content) {
          const { currentLocaleModalsContent, defaultLocaleModalsContent } = useGlobalStore();
          const camelCaseContentName = camelCase(this.modalsList[modalName].content);

          this.modals[modalName] = useModal({
            component: modalComponent,
            attrs: {
              currentLocaleData: currentLocaleModalsContent?.[camelCaseContentName],
              defaultLocaleData: defaultLocaleModalsContent?.[camelCaseContentName],
              ...params?.props,
            },
          });
        } else {
          this.modals[modalName] = useModal({
            component: modalComponent,
            attrs: { ...params?.props },
          });
        }
      } else if (params?.props) {
        const currentModalOptions = this.modals[modalName].options;
        const newOptions = {
          ...currentModalOptions,
          attrs: { ...(currentModalOptions.attrs as object), ...params.props },
        };
        this.modals[modalName].patchOptions(newOptions);
      }

      if ((params?.prohibitQueryChange ?? true) && this.modalsList[modalName].queryName)
        await this.addModalQuery(modalName, params?.modalQueryValue);
      this.modals[modalName].open();
      this.openingModals = this.openingModals.filter(item => item !== modalName);
    },

    async closeModal(modalName: string): Promise<void> {
      this.modals[modalName]?.close();
      if (this.modalsList[modalName].queryName) await this.removeModalQuery(modalName);
    },

    async closeAllModals(): Promise<void> {
      // CAN'T USE "vfm.closeAll()" BECAUSE OF SKELETON AND PROJECTS MODALS
      const { query } = useRoute();
      const newQuery = { ...query };
      Object.keys(this.modals).forEach(modalName => {
        if (this.modals[modalName]?.options?.modelValue) {
          this.modals[modalName].close();
          const modalListQueryName: string | undefined = this.modalsList[modalName]?.queryName;
          if (modalListQueryName && query.hasOwnProperty(modalListQueryName)) delete newQuery[modalListQueryName];
        }
      });

      const router = useRouter();
      await router.replace({ query: newQuery });
    },

    async openWalletModal(modalType?: WalletModalTypes): Promise<void> {
      if (!this.accessToOpen('wallet') || this.walletOpening) return;
      this.walletOpening = true;

      const dayjs = useDayjs();
      const startModalLoad: Dayjs = dayjs();

      this.walletModalType = modalType;
      const walletStore = useWalletStore();
      const { setPaymentMethodsGeo, accountSwitching } = walletStore;
      setPaymentMethodsGeo();
      await accountSwitching;
      await this.openModal('wallet', { modalQueryValue: modalType });
      useEvent('analyticsEvent', {
        event: 'walletOpen',
        loadTime: dayjs().diff(startModalLoad),
      });

      this.walletOpening = false;
    },

    async checkOpenedModals(): Promise<void> {
      const route = useRoute();
      const queryArr = Object.keys(route.query);
      if (!queryArr.length) return;

      const modalsByQuery: { [key: string]: string } = {};
      Object.keys(this.modalsList).forEach(modalName => {
        const modalQueryName = this.modalsList[modalName].queryName;
        if (modalQueryName) modalsByQuery[modalQueryName] = modalName;
      });

      for (const queryName of queryArr) {
        if (!modalsByQuery[queryName]) return;

        if (!this.accessToOpen(modalsByQuery[queryName])) {
          await this.removeModalQuery(modalsByQuery[queryName]);
        } else if (modalsByQuery[queryName] === 'wallet') {
          const queryParam = route.query[queryName] as string;
          const modalType = ['deposit', 'withdraw'].includes(queryParam) ? (queryParam as WalletModalTypes) : undefined;
          await this.openWalletModal(modalType);
          break;
        } else {
          await this.openModal(modalsByQuery[queryName], { modalQueryValue: route.query[queryName] as string });
          break;
        }
      }
    },
  },
});

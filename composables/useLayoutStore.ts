import { defineStore } from 'pinia';
import { useWalletStore } from '~/composables/useWalletStore';
import { useProfileStore } from '~/composables/useProfileStore';

export type LayoutStoreStateType = {
  isUserNavOpen: boolean,
  isDrawerOpen: boolean,
  isCurrencyNavOpen: boolean,
  isDrawerCompact: boolean,
  isShowAlert: boolean,
  alertProps: {
    title: string | undefined,
    text: string | undefined,
    variant: 'info' | 'error' | 'warning' | 'done' | undefined,
  },
  modals: {
    register: boolean,
    signIn: boolean,
    deposit: boolean,
    confirm: boolean,
    confirmBonus: boolean,
    error: boolean,
    forgotPass: boolean,
    resetPass: boolean,
    success: boolean,
    withdraw: boolean,
  },
  modalsUrl: {
    register: string,
    signIn: string,
    success: string,
    error: string,
  },
}

export const useLayoutStore = defineStore('layoutStore', {
  state: () => ({
      isUserNavOpen: false,
      isDrawerOpen: false,
      isCurrencyNavOpen: false,
      isDrawerCompact: false,
      isShowAlert: false,
      alertProps: {
        title: undefined,
        text: undefined,
        variant: undefined,
      },
      modals: {
        register: false,
        signIn: false,
        deposit: false,
        confirm: false,
        confirmBonus: false,
        error: false,
        forgotPass: false,
        resetPass: false,
        success: false,
        withdraw: false,
      },
      modalsUrl: {
        register: 'sign-up',
        signIn: 'sign-in',
        success: 'success',
        error: 'error',
      },
  } as LayoutStoreStateType),

  actions: {
    showAlert(props: LayoutStoreStateType['alertProps']): void {
      this.isShowAlert = true;
      this.alertProps = props;
    },

    hideAlert() {
      this.isShowAlert = false;
    },

    openUserNav():void {
      this.isUserNavOpen = true;
      document.body.classList.add('nav-user-open');
    },

    closeUserNav():void {
      this.isUserNavOpen = false;
      document.body.classList.remove('nav-user-open');
    },

    openCurrencyNav():void {
      this.isCurrencyNavOpen = true;
      document.body.classList.add('nav-currency-open');
    },

    closeCurrencyNav():void {
      this.isCurrencyNavOpen = false;
      document.body.classList.remove('nav-currency-open');
    },

    toggleDrawer():void {
      this.isDrawerOpen = !this.isDrawerOpen;
      document.body.classList.toggle('drawer-open');
    },

    compactDrawer():void {
      this.isDrawerCompact = !this.isDrawerCompact;
      const getMainLayout = document.querySelector('.main-layout');
      getMainLayout.classList.toggle('drawer-minimize');
      window.dispatchEvent(new Event('resize'));
    },

    addModalQuery(modalName:string):void {
      const router = useRouter();
      const { query } = useRoute();
      const modalsArr = Object.keys(this.modals);
      const newQuery = { ...query };

      modalsArr.forEach((modalKey) => {
        if (modalKey !== modalName) {
          this.modals[modalKey] = false;
          newQuery[this.modalsUrl[modalKey]] = undefined;
        } else newQuery[this.modalsUrl[modalKey]] = 'true';
      });
      router.replace({ query: newQuery });
    },

    removeModalQuery(modalName:string):void {
      const router = useRouter();
      const { query } = useRoute();

      router.replace({ query: { ...query, [this.modalsUrl[modalName]]: undefined } });
    },

    showModal(modalName: string):void {
      this.modals[modalName] = true;
      if (this.modalsUrl[modalName]) this.addModalQuery(modalName);
    },

    closeModal(modalName: string):void {
      this.modals[modalName] = false;
      if (this.modalsUrl[modalName]) this.removeModalQuery(modalName);
    },

    checkModals():void {
      const route = useRoute();
      const { isLoggedIn } = useProfileStore();
      const queryArr = Object.keys(route.query);

      queryArr.forEach((query) => {
        if (query === 'sign-up') {
          isLoggedIn ? this.closeModal('register') : this.showModal('register');
        } else if (query === 'register') {
          isLoggedIn ? this.closeModal('signIn') : this.showModal('signIn');
        } else if (this.modalsUrl[query]) {
          this.showModal(query);
        }
      });
    },

    async openDepositModal():Promise<void> {
      const { getDepositMethods } = useWalletStore();
      await getDepositMethods();
      this.showModal('deposit');
    },

    async openWithdrawModal():Promise<void> {
      const { getWithdrawMethods } = useWalletStore();
      await getWithdrawMethods();
      this.showModal('withdraw');
    },
  },
});

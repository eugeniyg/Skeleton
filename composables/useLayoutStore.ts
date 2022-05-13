import { defineStore } from 'pinia';

export type layoutStoreStateType = {
  isUserNavOpen: boolean,
  isDrawerOpen: boolean,
  isCurrencyNavOpen: boolean,
  isDrawerCompact: boolean,
  showRegisterModal: boolean,
  modals: {
    deposit: boolean,
    withDraw: boolean,
    successDeposit: boolean,
    error: boolean,
    register: boolean,
    confirm: boolean,
  },
}

export const useLayoutStore = defineStore('layoutStore', {
  state: () => ({
      isUserNavOpen: false,
      isDrawerOpen: false,
      isCurrencyNavOpen: false,
      isDrawerCompact: false,
      showRegisterModal: false,
      modals: {
        deposit: false,
        withDraw: false,
        successDeposit: false,
        error: false,
        register: false,
        confirm: false,
      },
  } as layoutStoreStateType),

  actions: {
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

    showModal(modalName: string):void {
      this.modals[modalName] = true;
    },

    closeModal(modalName: string):void {
      this.modals[modalName] = false;
    },
  },
});

import { defineStore } from 'pinia';

export type LayoutStoreStateType = {
  isUserNavOpen: boolean,
  isDrawerOpen: boolean,
  isCurrencyNavOpen: boolean,
  isDrawerCompact: boolean,
  modals: {
    register: boolean,
    signIn: boolean,
    deposit: boolean,
  },
  modalsUrl: {
    register: string,
    signIn: string,
    deposit: string,
  },
}

export const useLayoutStore = defineStore('layoutStore', {
  state: () => ({
      isUserNavOpen: false,
      isDrawerOpen: false,
      isCurrencyNavOpen: false,
      isDrawerCompact: false,
      modals: {
        register: false,
        signIn: false,
        deposit: false,
      },
      modalsUrl: {
        register: 'sign-up',
        signIn: 'sign-in',
        deposit: 'deposit',
      },
  } as LayoutStoreStateType),

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
      this.addModalQuery(modalName);
    },

    closeModal(modalName: string):void {
      this.modals[modalName] = false;
      this.removeModalQuery(modalName);
    },
  },
});

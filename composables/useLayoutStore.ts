import { defineStore } from 'pinia';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useNotification } from '@kyvg/vue3-notification';
import { IAlert } from "~/types";

interface IModals extends Record<string, any> {
  register: boolean,
  registerCancel: boolean,
  signIn: boolean,
  deposit: boolean,
  confirm: boolean,
  error: boolean,
  forgotPass: boolean,
  resetPass: boolean,
  success: boolean,
  withdraw: boolean,
  fiat: boolean,
}

interface IModalsUrls extends Record<string, any> {
  register: string,
  signIn: string,
  success: string,
  error: string,
  confirm: string,
  forgotPass: string,
  resetPass: string,
}

interface ILayoutStoreState extends Record<string, any>{
  isUserNavOpen: boolean,
  isDrawerOpen: boolean,
  isCurrencyNavOpen: boolean,
  isDrawerCompact: boolean,
  showCookiePopup: boolean,
  modals: IModals,
  modalsUrl: IModalsUrls,
  lastNotificationTime: number,
}

export const useLayoutStore = defineStore('layoutStore', {
  state: (): ILayoutStoreState => ({
      isUserNavOpen: false,
      isDrawerOpen: false,
      isCurrencyNavOpen: false,
      isDrawerCompact: false,
      showCookiePopup: false,
      modals: {
        register: false,
        signIn: false,
        deposit: false,
        confirm: false,
        error: false,
        forgotPass: false,
        resetPass: false,
        success: false,
        withdraw: false,
        registerCancel: false,
        fiat: false,
      },
      modalsUrl: {
        register: 'sign-up',
        signIn: 'sign-in',
        success: 'success',
        error: 'error',
        confirm: 'confirm',
        forgotPass: 'forgot-pass',
        resetPass: 'reset-pass',
      },
    lastNotificationTime: 0,
  }),

  actions: {
    showAlert(props: Maybe<IAlert>): void {
      const { notify } = useNotification();
      const currentTime = Date.now();
      const timeDiff = currentTime - this.lastNotificationTime;

      if (timeDiff < 400) {
        this.lastNotificationTime += 400;

        setTimeout(() => {
          notify({
            id: Date.now(),
            type: props?.type,
            title: props?.title,
            text: props?.description,
          });
        }, this.lastNotificationTime - currentTime);
      } else {
        this.lastNotificationTime = currentTime;

        notify({
          id: currentTime,
          type: props?.type,
          title: props?.title,
          text: props?.description,
        });
      }
    },

    openUserNav():void {
      this.isUserNavOpen = true;
      document.body.classList.add('nav-user-open');
      const userNavEl:HTMLElement|null = document.querySelector('.nav-user');
      if (userNavEl) disableBodyScroll(userNavEl);
    },

    closeUserNav():void {
      this.isUserNavOpen = false;
      document.body.classList.remove('nav-user-open');
      const userNavEl:HTMLElement|null = document.querySelector('.nav-user');
      if (userNavEl) enableBodyScroll(userNavEl);
    },

    openCurrencyNav():void {
      this.isCurrencyNavOpen = true;
      document.body.classList.add('nav-currency-open');
    },

    closeCurrencyNav():void {
      this.isCurrencyNavOpen = false;
      document.body.classList.remove('nav-currency-open');
    },

    async compactDrawer(compact: boolean, writeStorage = true):Promise<void> {
      if (writeStorage) localStorage.setItem('IS_DRAWER_COMPACT', `${compact}`);
      this.isDrawerCompact = compact;
      await nextTick();
      window.dispatchEvent(new Event('resize'));
    },

    toggleDrawer():void {
      this.isDrawerOpen = !this.isDrawerOpen;
      document.body.classList.toggle('drawer-open');
      const drawerContentEl:HTMLElement|null = document.querySelector('.drawer .content');
      if (drawerContentEl) this.isDrawerOpen ? disableBodyScroll(drawerContentEl) : enableBodyScroll(drawerContentEl);
    },

    addModalQuery(modalName:string, queryValue: Maybe<string>):void {
      const router = useRouter();
      const { query } = useRoute();
      const modalsArr = Object.keys(this.modals);
      const newQuery:any = { ...query };

      modalsArr.forEach((modalKey) => {
        if (modalKey !== modalName) {
          this.modals[modalKey] = false;
          newQuery[this.modalsUrl[modalKey]] = undefined;
        } else newQuery[this.modalsUrl[modalKey]] = queryValue || 'true';
      });
      router.replace({ query: newQuery });
    },

    removeModalQuery(modalName:string):void {
      const router = useRouter();
      const { query } = useRoute();

      router.replace({ query: { ...query, [this.modalsUrl[modalName]]: undefined, resetCode: undefined } });
    },

    showModal(modalName: string, queryValue?:string):void {
      this.modals[modalName] = true;
      if (this.modalsUrl[modalName]) this.addModalQuery(modalName, queryValue);
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
        const modalKey = Object.keys(this.modalsUrl).find((key) => this.modalsUrl[key] === query);
        if (!modalKey) return;

        const authModals = ['register', 'signIn', 'forgotPass', 'resetPass'];
        if (authModals.includes(modalKey)) {
          isLoggedIn ? this.closeModal(modalKey) : this.showModal(modalKey);
        } else {
          this.showModal(modalKey, route.query?.[query] as string);
        }
      });
    },

    async openDepositModal():Promise<void> {
      const { getDepositMethods } = useWalletStore();
      const { showModal } = useLimitsStore();
      try {
        await getDepositMethods();
        this.showModal('deposit');
      } catch (error: any) {
        if (error.data?.error?.code === 13100) {
          const router = useRouter();
          const { localizePath } = useProjectMethods();
          await router.push(localizePath('/profile/limits'));
          showModal('depositLimitReached');
        } else throw error;
      }
    },

    async openWithdrawModal():Promise<void> {
      const { getWithdrawMethods } = useWalletStore();
      await getWithdrawMethods();
      this.showModal('withdraw');
    },
  },
});

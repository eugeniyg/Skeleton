import { defineStore } from 'pinia';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useNotification } from '@kyvg/vue3-notification';
import type { IAlert } from "~/types";
import type { IGame } from "@skeleton/core/types";

type WalletModalTypes = 'deposit'|'withdraw'|undefined;
interface IModals extends Record<string, any> {
  register: boolean;
  registerCancel: boolean;
  signIn: boolean;
  wallet: boolean;
  cancelDeposit: boolean;
  walletBonusDetails: boolean;
  confirm: boolean;
  error: boolean;
  forgotPass: boolean;
  resetPass: boolean;
  success: boolean;
  fiat: boolean;
}

interface IModalsUrls extends Record<string, any> {
  register: string;
  signIn: string;
  success: string;
  error: string;
  confirm: string;
  forgotPass: string;
  resetPass: string;
  wallet: string;
}

interface ILayoutStoreState extends Record<string, any>{
  isUserNavOpen: boolean;
  isDrawerOpen: boolean;
  isCurrencyNavOpen: boolean;
  isDrawerCompact: boolean;
  showCookiePopup: boolean;
  modals: IModals;
  modalsUrl: IModalsUrls;
  lastNotificationTime: number;
  returnGame: Maybe<string|IGame>;
  walletModalType: WalletModalTypes;
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
        wallet: false,
        cancelDeposit: false,
        walletBonusDetails: false,
        confirm: false,
        error: false,
        forgotPass: false,
        resetPass: false,
        success: false,
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
        wallet: 'wallet'
      },
    lastNotificationTime: 0,
    returnGame: undefined,
    walletModalType: undefined
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
      if (this.isDrawerCompact) this.isDrawerCompact = false;
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
      if (this.modalsUrl[modalName]) this.addModalQuery(modalName, queryValue);
      this.modals[modalName] = true;
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

        const guestModals = ['register', 'signIn', 'forgotPass', 'resetPass'];
        const authModals = ['wallet'];
        if (guestModals.includes(modalKey)) {
          isLoggedIn ? this.closeModal(modalKey) : this.showModal(modalKey);
        } else if (authModals.includes(modalKey)) {
          if (!isLoggedIn) {
            this.closeModal(modalKey);
          } else if (modalKey === 'wallet') {
            const queryValue = route.query[query] as string;
            const modalType = ['deposit', 'withdraw'].includes(queryValue) ? queryValue as WalletModalTypes : undefined;
            this.openWalletModal(modalType);
          } else {
            this.showModal(modalKey);
          }
        } else {
          this.showModal(modalKey, route.query?.[query] as string);
        }
      });
    },

    async openWalletModal(modalType?: WalletModalTypes): Promise<void> {
      this.walletModalType = modalType;
      const { getDepositMethods, getWithdrawMethods, activeAccount } = useWalletStore();
      const { getDepositBonuses } = useBonusStore();
      await Promise.allSettled([
        getDepositMethods(),
        getWithdrawMethods(),
        getDepositBonuses(activeAccount?.currency as string)
      ]);

      this.showModal('wallet', modalType);
    },

    setReturnGame(gameData: Maybe<IGame|string>): void {
      if (gameData && this.returnGame !== 'disabled') {
        sessionStorage.setItem('returnGame', JSON.stringify(gameData));
        this.returnGame = gameData
      }
    },

    deleteReturnGame(): void {
      sessionStorage.removeItem('returnGame');
      this.returnGame = undefined
    }
  },

  getters: {
    isGamePage() {
      const route = useRoute();
      return route.name === 'games-id' || route.name === 'locale-games-id';
    },

    isHomePage() {
      const route = useRoute();
      return route.name === 'index' || route.name === 'locale-index';
    },

    isSportsbookPage() {
      const route = useRoute();
      return route.name === 'betting' || route.name === 'locale-betting';
    }
  }
});

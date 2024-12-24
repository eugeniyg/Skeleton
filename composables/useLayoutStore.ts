import { defineStore } from 'pinia';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useNotification } from '@kyvg/vue3-notification';
import type { IAlert } from '~/types';
import type { IGame } from '@skeleton/core/types';

interface IModals extends Record<string, any> {
  providers: boolean;
  categories: boolean;
  packageBonus: boolean;
}

interface ILayoutStoreState extends Record<string, any> {
  isUserNavOpen: boolean;
  isDrawerOpen: boolean;
  isCurrencyNavOpen: boolean;
  isDrawerCompact: boolean;
  showCookiePopup: boolean;
  modals: IModals;
  lastNotificationTime: number;
  returnGame: Maybe<string | IGame>;
}

export const useLayoutStore = defineStore('layoutStore', {
  state: (): ILayoutStoreState => ({
    isUserNavOpen: false,
    isDrawerOpen: false,
    isCurrencyNavOpen: false,
    isDrawerCompact: false,
    showCookiePopup: false,
    modals: {
      providers: false,
      categories: false,
      packageBonus: false,
    },
    lastNotificationTime: 0,
    returnGame: undefined,
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

    openUserNav(): void {
      this.isUserNavOpen = true;
      document.body.classList.add('nav-user-open');
      const userNavEl: HTMLElement | null = document.querySelector('.nav-user');
      if (userNavEl) disableBodyScroll(userNavEl);
    },

    closeUserNav(): void {
      if (!this.isUserNavOpen) return;
      this.isUserNavOpen = false;
      document.body.classList.remove('nav-user-open');
      const userNavEl: HTMLElement | null = document.querySelector('.nav-user');
      if (userNavEl) enableBodyScroll(userNavEl);
    },

    openCurrencyNav(): void {
      this.isCurrencyNavOpen = true;
      document.body.classList.add('nav-currency-open');
    },

    closeCurrencyNav(): void {
      this.isCurrencyNavOpen = false;
      document.body.classList.remove('nav-currency-open');
    },

    async compactDrawer(compact: boolean, writeStorage = true): Promise<void> {
      if (writeStorage) localStorage.setItem('IS_DRAWER_COMPACT', `${compact}`);
      this.isDrawerCompact = compact;
      await nextTick();
      window.dispatchEvent(new Event('resize'));
    },

    toggleDrawer(): void {
      this.isDrawerOpen = !this.isDrawerOpen;
      document.body.classList.toggle('drawer-open');
      const drawerContentEl: HTMLElement | null = document.querySelector('.drawer .content');
      const bodyScrollOptions = {
        allowTouchMove: (el: HTMLElement | Element) => {
          while (el && el !== document.body) {
            if (el.getAttribute('body-scroll-lock-ignore') !== null) {
              return true;
            }
            el = el.parentElement || document.body;
          }
          return false;
        },
      };
      if (drawerContentEl) {
        if (this.isDrawerOpen) disableBodyScroll(drawerContentEl, bodyScrollOptions);
        else enableBodyScroll(drawerContentEl);
      }
      if (this.isDrawerCompact) this.isDrawerCompact = false;
    },

    showModal(modalName: string): void {
      this.modals[modalName] = true;
    },

    async closeModal(modalName: string): Promise<void> {
      this.modals[modalName] = false;
    },

    setReturnGame(gameData: Maybe<IGame | string>): void {
      if (gameData && this.returnGame !== 'disabled') {
        sessionStorage.setItem('returnGame', JSON.stringify(gameData));
        this.returnGame = gameData;
      }
    },

    deleteReturnGame(): void {
      sessionStorage.removeItem('returnGame');
      this.returnGame = undefined;
    },
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
    },
  },
});

import { defineStore } from 'pinia';
import {
  PlayerBonusInterface,
  SocketBonusNotifyInterface,
  WebSocketResponseInterface,
} from '@platform/frontend-core/dist/module';
import { useLayoutStore } from '~/composables/useLayoutStore';
import { useGlobalStore } from '~/composables/useGlobalStore';

interface BonusStateInterface {
  bonusSubscription: any,
  playerBonuses: PlayerBonusInterface[]
}

export const useBonusStore = defineStore('bonusStore', {
  state: (): BonusStateInterface => ({
    bonusSubscription: undefined,
    playerBonuses: [],
  }),

  getters: {
    activePlayerBonuses(state):PlayerBonusInterface[] {
      const walletStore = useWalletStore();
      return state.playerBonuses.filter((playerBonus) => walletStore.activeAccount?.currency === playerBonus.currency);
    },

    activePlayerCashBonuses():PlayerBonusInterface[] {
      return this.activePlayerBonuses.filter((playerBonus) => playerBonus.bonusType === 1);
    },
  },

  actions: {
    async getPlayerBonuses():Promise<void> {
      const { getPlayerBonuses } = useCoreBonusApi();
      const data = await getPlayerBonuses({ status: [1, 2] });
      this.playerBonuses = data;
    },

    subscribeBonusSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.bonusSubscription = createSubscription(`bonus:player-bonus-codes#${profileStore.profile.id}`, this.showSocketBonusNotification);
      }
    },

    unsubscribeBonusSocket():void {
      if (this.bonusSubscription) {
        this.bonusSubscription.unsubscribe();
        this.bonusSubscription.removeAllListeners();
      }
    },

    showBonusNotification(status?: number):void {
      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();

      switch (status) {
        case 2:
          showAlert(alertsData?.bonusActivated || defaultLocaleAlertsData?.bonusActivated);
          break;
        case 3:
          showAlert(alertsData?.bonusIncorrect || defaultLocaleAlertsData?.bonusIncorrect);
          break;
        case 4:
          showAlert(alertsData?.bonusNotAvailable || defaultLocaleAlertsData?.bonusNotAvailable);
          break;
        default:
          showAlert(alertsData?.bonusIncorrect || defaultLocaleAlertsData?.bonusIncorrect);
          break;
      }
    },

    showSocketBonusNotification(webSocketResponse:WebSocketResponseInterface):void {
      const bonusNotificationData: Maybe<SocketBonusNotifyInterface> = webSocketResponse.data.playerBonusCode;
      this.showBonusNotification(bonusNotificationData?.status);
    },
  },
});

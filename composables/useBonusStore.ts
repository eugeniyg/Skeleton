import { defineStore } from 'pinia';
import {
  PlayerBonusInterface,
  BonusCodeInterface,
  WebSocketResponseInterface,
} from '@platform/frontend-core/dist/module';
import {PlayerFreeSpinInterface} from "@platform/frontend-core";

interface BonusStateInterface {
  bonusCodeSubscription: any,
  bonusSubscription: any,
  playerBonuses: PlayerBonusInterface[],
  playerFreeSpins: PlayerFreeSpinInterface[],
  depositBonusCode: Maybe<BonusCodeInterface>
}

export const useBonusStore = defineStore('bonusStore', {
  state: (): BonusStateInterface => ({
    bonusCodeSubscription: undefined,
    bonusSubscription: undefined,
    playerBonuses: [],
    playerFreeSpins: [],
    depositBonusCode: undefined,
  }),

  getters: {
    activePlayerBonuses(state):PlayerBonusInterface[] {
      const walletStore = useWalletStore();
      return state.playerBonuses.filter((playerBonus) => walletStore.activeAccount?.currency === playerBonus.currency);
    },

    activePlayerCashBonuses():PlayerBonusInterface[] {
      return this.activePlayerBonuses.filter((playerBonus) => [1,2].includes(playerBonus.bonusType));
    },

    activePlayerFreeSpins(state):PlayerFreeSpinInterface[] {
      const walletStore = useWalletStore();
      return state.playerFreeSpins.filter((playerFreeSpin) => walletStore.activeAccount?.currency === playerFreeSpin.currency);
    }
  },

  actions: {
    async getPlayerBonuses():Promise<void> {
      const { getPlayerBonuses } = useCoreBonusApi();
      const { data } = await getPlayerBonuses({ status: [1, 2] });
      this.playerBonuses = data;
    },

    async getPlayerFreeSpins():Promise<void> {
      const { getPlayerFreeSpins } = useCoreBonusApi();
      const { data } = await getPlayerFreeSpins({ status: [1, 2] });
      this.playerFreeSpins = data;
    },

    async getDepositBonusCode():Promise<void> {
      const { getBonusCodes } = useCoreBonusApi();

      const bonusCodeResponse = await getBonusCodes(3);
      this.depositBonusCode = bonusCodeResponse[0] || undefined;
    },

    showBonusCodeNotification(status?: number):void {
      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();

      if (status === 3) {
        showAlert(alertsData?.bonusCodeIncorrect || defaultLocaleAlertsData?.bonusCodeIncorrect);
      } else if (status === 4) {
        showAlert(alertsData?.bonusCodeNotAvailable || defaultLocaleAlertsData?.bonusCodeNotAvailable);
      }
    },

    subscribeBonusCodeSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.bonusCodeSubscription = createSubscription(`bonus:player-bonus-codes#${profileStore.profile.id}`, this.bonusCodeSocketTrigger);
      }
    },

    subscribeBonusSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.bonusCodeSubscription = createSubscription(`bonus:player-bonuses#${profileStore.profile.id}`, this.bonusesSocketTrigger);
      }
    },

    bonusCodeSocketTrigger(webSocketResponse:WebSocketResponseInterface):void {
      const bonusCodeData: Maybe<BonusCodeInterface> = webSocketResponse.data.playerBonusCode;
      this.showBonusCodeNotification(bonusCodeData?.status);
    },

    updatePlayerBonusList(bonusData: PlayerBonusInterface):void {
      if (bonusData.status === 1) this.playerBonuses = [...this.playerBonuses, bonusData];
      else if (bonusData.status === 2) {
        this.playerBonuses = this.playerBonuses.map((bonus) => {
          if (bonus.id === bonusData.id) return bonusData;
          return bonus;
        });
      } else {
        this.playerBonuses = this.playerBonuses.filter((bonus) => bonus.id !== bonusData.id);
      }
    },

    bonusesSocketTrigger(webSocketResponse:WebSocketResponseInterface):void {
      const bonusData: Maybe<PlayerBonusInterface> = webSocketResponse.data.playerBonus;
      if (!bonusData) return;

      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      const { formatBalance } = useProjectMethods();
      const { status, result } = bonusData;
      const formattedAmount = formatBalance(bonusData.currency, bonusData.amount);

      const alertsKey: { [key: string]: string } = {
        // key - '{status}-{result}'
        '1-1': 'bonusIssued',
        '2-1': 'bonusActivated',
        '3-2': 'bonusPlayed',
        '3-3': 'bonusCanceled',
        '3-4': 'bonusExpired',
        '3-5': 'bonusLost',
      };

      const transformMessage = (message?: string):string => {
        if (!message) return '';
        return message.replace('{amount}', `<b>${formattedAmount.amount} ${formattedAmount.currency}</b>`);
      };

      const alertData = alertsData?.[alertsKey[`${status}-${result}`]]
        || defaultLocaleAlertsData?.[alertsKey[`${status}-${result}`]];

      this.updatePlayerBonusList(bonusData);
      if (alertData) showAlert({ ...alertData, description: transformMessage(alertData?.description) });
    },

    unsubscribeBonusCodeSocket():void {
      if (this.bonusCodeSubscription) {
        this.bonusCodeSubscription.unsubscribe();
        this.bonusCodeSubscription.removeAllListeners();
      }
    },

    unsubscribeBonusSocket():void {
      if (this.bonusSubscription) {
        this.bonusSubscription.unsubscribe();
        this.bonusSubscription.removeAllListeners();
      }
    },
  },
});

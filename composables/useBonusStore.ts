import { defineStore } from 'pinia';
import {
  IPlayerBonus,
  IBonusCode,
  IWebSocketResponse,
  IGame,
  IPlayerFreeSpin
} from '@platform/frontend-core';

interface IBonusState {
  bonusCodeSubscription: any,
  bonusSubscription: any,
  freeSpinsSubscription: any,
  playerBonuses: IPlayerBonus[],
  playerFreeSpins: IPlayerFreeSpin[],
  depositBonusCode: Maybe<IBonusCode>
}

export const useBonusStore = defineStore('bonusStore', {
  state: (): IBonusState => ({
    bonusCodeSubscription: undefined,
    bonusSubscription: undefined,
    freeSpinsSubscription: undefined,
    playerBonuses: [],
    playerFreeSpins: [],
    depositBonusCode: undefined,
  }),

  getters: {
    activePlayerBonuses(state):IPlayerBonus[] {
      const walletStore = useWalletStore();
      return state.playerBonuses.filter((playerBonus) => walletStore.activeAccount?.currency === playerBonus.currency);
    },

    activePlayerFreeSpins(state):IPlayerFreeSpin[] {
      const walletStore = useWalletStore();
      return state.playerFreeSpins.filter((playerFreeSpin) => walletStore.activeAccount?.currency === playerFreeSpin.currency);
    },

    currentActiveBonus(): Maybe<IPlayerBonus> {
      return this.activePlayerBonuses.find((bonus) => bonus.status === 2);
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
        showAlert(alertsData?.bonus?.bonusCodeIncorrect || defaultLocaleAlertsData?.bonus?.bonusCodeIncorrect);
      } else if (status === 4) {
        showAlert(alertsData?.bonus?.bonusCodeNotAvailable || defaultLocaleAlertsData?.bonus?.bonusCodeNotAvailable);
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
        this.bonusSubscription = createSubscription(`bonus:player-bonuses#${profileStore.profile.id}`, this.bonusesSocketTrigger);
      }
    },

    subscribeFreeSpinsSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.freeSpinsSubscription = createSubscription(`bonus:player-freespins#${profileStore.profile.id}`, this.freeSpinsSocketTrigger);
      }
    },

    bonusCodeSocketTrigger(webSocketResponse:IWebSocketResponse):void {
      const bonusCodeData: Maybe<IBonusCode> = webSocketResponse.data.playerBonusCode;
      this.showBonusCodeNotification(bonusCodeData?.status);
    },

    updatePlayerBonusList(bonusData: IPlayerBonus):void {
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

    updatePlayerFreeSpinsList(freeSpinData: IPlayerFreeSpin):void {
      if (freeSpinData.status === 1) this.playerFreeSpins = [...this.playerFreeSpins, freeSpinData];
      else if (freeSpinData.status === 2) {
        this.playerFreeSpins = this.playerFreeSpins.map((freeSpin) => {
          if (freeSpin.id === freeSpinData.id) return freeSpinData;
          return freeSpin;
        });
      } else {
        this.playerFreeSpins = this.playerFreeSpins.filter((freeSpin) => freeSpin.id !== freeSpinData.id);
      }
    },

    bonusesSocketTrigger(webSocketResponse:IWebSocketResponse):void {
      const bonusData: Maybe<IPlayerBonus> = webSocketResponse.data.playerBonus;
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

      const alertData = alertsData?.bonus?.[alertsKey[`${status}-${result}`]]
        || defaultLocaleAlertsData?.bonus?.[alertsKey[`${status}-${result}`]];

      this.updatePlayerBonusList(bonusData);
      if (alertData) showAlert({ ...alertData, description: transformMessage(alertData?.description) });
    },

    async freeSpinsSocketTrigger(webSocketResponse: IWebSocketResponse):Promise<void> {
      const freeSpinData: Maybe<IPlayerFreeSpin> = webSocketResponse.data.playerFreespin;
      if (!freeSpinData) return;

      const { showAlert } = useLayoutStore();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      const {
        count,
        currency,
        gameId,
        status,
        result
      } = freeSpinData;

      const alertsKey: { [key: string]: string } = {
        // key - '{status}-{result}'
        '1-1': 'freeSpinIssued',
        '2-1': 'freeSpinActivated',
        '3-2': 'freeSpinPlayed',
        '3-3': 'freeSpinCanceled',
        '3-4': 'freeSpinExpired'
      };

      const { getGamesInfo } = useCoreGamesApi();
      const { localizePath } = useProjectMethods();
      let gameInfo: IGame
      try {
        gameInfo = await getGamesInfo(gameId);
      } catch {
        console.error('Something went wrong with game info fetching!');
      }

      const transformMessage = (message?: string):string => {
        if (!message) return '';

        let editedMessage = message.replace('{count}', `<b>${count} free spins</b>`);
        editedMessage = editedMessage.replace('{currency}', `<b>${currency}</b>`);
        const gameLink = gameInfo ? localizePath(`/games/${gameInfo.identity}`) : undefined;
        editedMessage = editedMessage.replace('{game}', gameLink ? `<a href="${gameLink}">${gameInfo.name}</a>` : '');
        return editedMessage;
      };

      const alertData = alertsData?.freeSpin?.[alertsKey[`${status}-${result}`]]
        || defaultLocaleAlertsData?.freeSpin?.[alertsKey[`${status}-${result}`]];

      this.updatePlayerFreeSpinsList(freeSpinData);
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

    unsubscribeFreeSpinsSocket():void {
      if (this.freeSpinsSubscription) {
        this.freeSpinsSubscription.unsubscribe();
        this.freeSpinsSubscription.removeAllListeners();
      }
    },
  },
});

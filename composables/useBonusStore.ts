import { defineStore } from 'pinia';
import type {
  IPlayerBonus,
  IBonusCode,
  IWebSocketResponse,
  IGame,
  IPlayerFreeSpin,
  IPlayerCashback,
  IBonus
} from '@skeleton/core/types';
import debounce from 'lodash/debounce.js';

interface IBonusState {
  bonusCodeSubscription: any;
  bonusSubscription: any;
  freeSpinsSubscription: any;
  playerBonuses: IPlayerBonus[];
  playerFreeSpins: IPlayerFreeSpin[];
  playerCashback: IPlayerCashback[];
  depositBonusCode: Maybe<IBonusCode>;
  depositBonuses: IBonus[];
  selectedDepositBonus: IBonus|undefined;
  bonusDeclined: boolean;
  depositMoreInfoBonus: Maybe<Record<string, any>>;
  showDepositBonusCode: boolean;
  walletDepositBonus: {
    id: string;
    packageId: string|undefined;
    amount?: number;
  }|undefined;
}

export const useBonusStore = defineStore('bonusStore', {
  state: (): IBonusState => ({
    bonusCodeSubscription: undefined,
    bonusSubscription: undefined,
    freeSpinsSubscription: undefined,
    playerBonuses: [],
    playerFreeSpins: [],
    playerCashback: [],
    depositBonusCode: undefined,
    depositBonuses: [],
    selectedDepositBonus: undefined,
    bonusDeclined: false,
    depositMoreInfoBonus: undefined,
    showDepositBonusCode: false,
    walletDepositBonus: undefined,
  }),

  getters: {
    activePlayerBonuses(state):IPlayerBonus[] {
      return state.playerBonuses.filter(playerBonus => playerBonus.status === 2);
    },

    issuedPlayerBonuses(state):IPlayerBonus[] {
      return state.playerBonuses.filter(playerBonus => playerBonus.status === 1);
    },

    activePlayerFreeSpins(state):IPlayerFreeSpin[] {
      return state.playerFreeSpins.filter(playerFreeSpin => playerFreeSpin.status === 2);
    },

    issuedPlayerFreeSpins(state):IPlayerFreeSpin[] {
      return state.playerFreeSpins.filter(playerFreeSpin => playerFreeSpin.status === 1);
    },
    bonusesCount(state):number {
      const playerPackageBonuses = [...state.playerBonuses, ...state.playerFreeSpins]
        .map(bonus => (bonus as IPlayerBonus|IPlayerFreeSpin).packageId)
        .filter((id, index, array) => id && array.indexOf(id) === index);

      const depositPackageBonuses = state.depositBonuses
        .map(bonus => bonus.package?.id)
        .filter((id, index, array) => id && array.indexOf(id) === index);

      const simplePlayerBonuses = [...state.playerBonuses, ...state.playerFreeSpins]
        .filter(bonus => !(bonus as IPlayerBonus|IPlayerFreeSpin).packageId);

      const simpleDepositBonuses = state.depositBonuses.filter(bonus => !bonus.package?.id);

      return playerPackageBonuses.length
        + depositPackageBonuses.length
        + simplePlayerBonuses.length
        + simpleDepositBonuses.length;
    },
  },

  actions: {
    async getPlayerBonuses():Promise<void> {
      const { activeAccount } = useWalletStore();
      if (!activeAccount?.currency) return;
      const { getPlayerBonuses } = useCoreBonusApi();
      const { data } = await getPlayerBonuses({ status: [1, 2], currency: [activeAccount.currency] });
      this.playerBonuses = data;
    },

    async getPlayerFreeSpins():Promise<void> {
      const { activeAccount } = useWalletStore();
      if (!activeAccount?.currency) return;
      const { getPlayerFreeSpins } = useCoreBonusApi();
      const { data } = await getPlayerFreeSpins({ status: [1, 2], currency: [activeAccount.currency] });
      this.playerFreeSpins = data;
    },

    async getPlayerCashback():Promise<void> {
      const { activeAccount } = useWalletStore();
      if (!activeAccount?.currency) return;
      const { getPlayerCashback } = useCoreBonusApi();
      const { data } = await getPlayerCashback(activeAccount.currency);
      this.playerCashback = data;
    },

    async getDepositBonuses():Promise<void> {
      const { activeAccount } = useWalletStore();
      if (!activeAccount?.currency) return;
      const { getDepositBonuses } = useCoreBonusApi();
      this.depositBonuses = await getDepositBonuses(activeAccount.currency);
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
        this.bonusCodeSubscription = createSubscription(`bonus:player-bonus-codes#${profileStore.profile?.id}`, this.bonusCodeSocketTrigger);
      }
    },

    subscribeBonusSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.bonusSubscription = createSubscription(`bonus:player-bonuses#${profileStore.profile?.id}`, this.bonusesSocketTrigger);
      }
    },

    subscribeFreeSpinsSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.freeSpinsSubscription = createSubscription(`bonus:player-freespins#${profileStore.profile?.id}`, this.freeSpinsSocketTrigger);
      }
    },

    bonusCodeSocketTrigger(webSocketResponse:IWebSocketResponse):void {
      const bonusCodeData: Maybe<IBonusCode> = webSocketResponse.data.playerBonusCode;
      this.showBonusCodeNotification(bonusCodeData?.status);
    },

    updatePlayerBonusList: debounce(async (bonusData: IPlayerBonus, thisStore: any) => {
      if ([1,2].includes(bonusData.status)) await thisStore.getPlayerBonuses();
      else {
        thisStore.playerBonuses = thisStore.playerBonuses.filter((bonus: IPlayerBonus) => bonus.id !== bonusData.id);
      }

      useEvent('bonusesUpdated');
    }, 500, { leading: false }),

    updatePlayerFreeSpinsList: debounce(async (freeSpinData: IPlayerFreeSpin, thisStore: any) => {
      if ([1, 2].includes(freeSpinData.status)) await thisStore.getPlayerFreeSpins();
      else {
        thisStore.playerFreeSpins = thisStore.playerFreeSpins.filter((freeSpin: IPlayerFreeSpin) => freeSpin.id !== freeSpinData.id);
      }

      useEvent('freeSpinsUpdated');
    }, 500, { leading: false }),

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

      this.updatePlayerBonusList(bonusData, this);
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

      this.updatePlayerFreeSpinsList(freeSpinData, this);
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

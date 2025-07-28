import type { IBetExceptionEvent, ICollection, IGame, IGameProvider } from '@skeleton/api/types';
import { getGameProviders, getGameCollections, getFavorite, setFavorite, deleteFavorite } from '@skeleton/api/games';
import { formatBalance } from '@skeleton/helpers/amountMethods';

type MobileModalType = 'depositOrDemo' | 'deposit' | 'registerOrDemo' | 'registerOrLogin';
interface IGamesStoreState {
  gameProviders: IGameProvider[];
  collectionsList: ICollection[];
  favoriteGames: IGame[];
  betsSubscription: any;
  mobileGameModalType: Maybe<MobileModalType>;
  mobileGameModalInfo: Maybe<IGame>;
  isBonusWagering: boolean;
  minimumBonusWagerMultiplier: number;
}

export const useGamesStore = defineStore('gamesStore', {
  state: (): IGamesStoreState => ({
    gameProviders: [],
    collectionsList: [],
    favoriteGames: [],
    betsSubscription: undefined,
    mobileGameModalType: undefined,
    mobileGameModalInfo: undefined,
    isBonusWagering: false,
    minimumBonusWagerMultiplier: 1,
  }),

  getters: {
    collectionsByCountry(state): ICollection[] {
      const globalStore = useGlobalStore();
      if (!globalStore.headerCountry) return state.collectionsList;

      const filteredCollections: ICollection[] = [];
      state.collectionsList.forEach(collection => {
        const correctCondition =
          !collection.countries.length || collection.countries.includes(globalStore.headerCountry as string);
        if (correctCondition) filteredCollections.push(collection);
      });
      return filteredCollections;
    },
  },

  actions: {
    async getProviders(cache?: IGameProvider[]): Promise<IGameProvider[]> {
      try {
        this.gameProviders = cache ?? (await getGameProviders());
      } catch {
        this.gameProviders = [];
      }

      return this.gameProviders;
    },

    async getCollections(cache?: ICollection[]): Promise<ICollection[]> {
      try {
        this.collectionsList = cache ?? (await getGameCollections());
      } catch {
        this.collectionsList = [];
      }

      return this.collectionsList;
    },

    async getFavoriteGames(): Promise<void> {
      this.favoriteGames = await getFavorite();
    },

    async setFavoriteGame(gameId: string): Promise<void> {
      this.favoriteGames = await setFavorite(gameId);
    },

    async deleteFavoriteGame(gameId: string): Promise<void> {
      this.favoriteGames = await deleteFavorite(gameId);
    },

    async openMobileGameModal(modalType: MobileModalType, gameInfo: IGame): Promise<void> {
      this.mobileGameModalType = modalType;
      this.mobileGameModalInfo = gameInfo;
      const { openModal } = useModalStore();
      await openModal('mobile-game');
    },

    defineBonusWagerInfo(isBonusWagering: boolean, minimumBonusWagerMultiplier: number): void {
      this.isBonusWagering = isBonusWagering;
      this.minimumBonusWagerMultiplier = minimumBonusWagerMultiplier;
    },

    handleBetsEvent(socketData: IBetExceptionEvent): void {
      const betsEvent = socketData.data.event;
      if (betsEvent === 'game.bet.restricted') useEvent('restrictedBets', socketData.data.gameIdentity as string);
      else if (betsEvent === 'game.bet.max.exceed') {
        const bonusCurrency = socketData.data.playerBonus?.currency;
        const bonusMaxAmount = socketData.data.playerBonus?.maxBetAmount;
        if (!bonusCurrency || !bonusMaxAmount) return;
        const maxBetBalance = formatBalance(bonusCurrency, bonusMaxAmount);
        useEvent('maxBets', {
          gameIdentity: socketData.data.gameIdentity as string,
          maxBet: `${maxBetBalance.amount} ${maxBetBalance.currency}`,
        });
      }
    },

    subscribeBetsSocket(): void {
      const { createSubscription } = useWebSocketStore();
      const profileStore = useProfileStore();
      this.betsSubscription = createSubscription(`game:bets#${profileStore.profile?.id}`, this.handleBetsEvent);
    },

    unsubscribeBetsSocket(): void {
      if (this.betsSubscription) {
        this.betsSubscription.unsubscribe();
        this.betsSubscription.removeAllListeners();
      }
    },
  },
});

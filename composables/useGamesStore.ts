import { defineStore } from 'pinia';
import type { IBetExceptionEvent, ICollection, IGame, IGameProvider } from '@skeleton/core/types';

type MobileModalType = 'depositOrDemo' | 'deposit' | 'registerOrDemo' | 'registerOrLogin';
interface IGamesStoreState {
  gameProvidersPromise: Promise<IGameProvider[]> | null;
  gameCollectionsPromise: Promise<ICollection[]> | null;
  favoriteGames: IGame[];
  betsSubscription: any;
  mobileGameModalType: Maybe<MobileModalType>;
  mobileGameModalInfo: Maybe<IGame>;
  isBonusWagering: boolean;
  minimumBonusWagerMultiplier: number;
}

export const useGamesStore = defineStore('gamesStore', {
  state: (): IGamesStoreState => ({
    gameProvidersPromise: null,
    gameCollectionsPromise: null,
    favoriteGames: [],
    betsSubscription: undefined,
    mobileGameModalType: undefined,
    mobileGameModalInfo: undefined,
    isBonusWagering: false,
    minimumBonusWagerMultiplier: 1,
  }),

  actions: {
    async getProvidersRequest(): Promise<IGameProvider[]> {
      const { getGameProviders } = useCoreGamesApi();

      try {
        return await getGameProviders();
      } catch {
        return [];
      }
    },

    async getProviderList(): Promise<IGameProvider[]> {
      if (!this.gameProvidersPromise) {
        this.gameProvidersPromise = this.getProvidersRequest();
      }
      return this.gameProvidersPromise;
    },

    async getCollectionsRequest(): Promise<ICollection[]> {
      const { getGameCollections } = useCoreGamesApi();

      try {
        const gameCollections = await getGameCollections();
        const globalStore = useGlobalStore();
        if (!globalStore.headerCountry) return gameCollections;

        return gameCollections.filter(collection => {
          return !collection.countries.length || collection.countries.includes(globalStore.headerCountry as string);
        });
      } catch {
        return [];
      }
    },

    async getCollectionsList(): Promise<ICollection[]> {
      if (!this.gameCollectionsPromise) {
        this.gameCollectionsPromise = this.getCollectionsRequest();
      }
      return this.gameCollectionsPromise;
    },

    async getFavoriteGames(): Promise<void> {
      const { getFavorite } = useCoreGamesApi();
      this.favoriteGames = await getFavorite();
    },

    async setFavoriteGame(gameId: string): Promise<void> {
      const { setFavorite } = useCoreGamesApi();
      this.favoriteGames = await setFavorite(gameId);
    },

    async deleteFavoriteGame(gameId: string): Promise<void> {
      const { deleteFavorite } = useCoreGamesApi();
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
        const { formatBalance } = useProjectMethods();
        const maxBetBalance = formatBalance(bonusCurrency, bonusMaxAmount);
        useEvent('maxBets', {
          gameIdentity: socketData.data.gameIdentity as string,
          maxBet: `${maxBetBalance.amount} ${maxBetBalance.currency}`,
        });
      }
    },

    subscribeBetsSocket(): void {
      const { createSubscription } = useWebSocket();
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

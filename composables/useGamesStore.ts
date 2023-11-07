import {defineStore} from 'pinia';
import type {
  ICollection,
  IGame,
  IGameProvider,
  IWinner,
  IWebSocketResponse
} from '@skeleton/core/types';
import throttle from 'lodash/throttle';

type MobileModalType = 'depositOrDemo'|'deposit'|'registerOrDemo'|'registerOrLogin';
interface IGamesStoreState {
  gameProviders: IGameProvider[];
  gameCollections: ICollection[];
  favoriteGames: IGame[];
  winnersSubscription: any;
  latestWinners: IWinner[];
  showMobileGameModal: boolean;
  mobileGameModalType: Maybe<MobileModalType>;
  mobileGameModalInfo: Maybe<IGame>;
}

export const useGamesStore = defineStore('gamesStore', {
  state: ():IGamesStoreState => ({
    gameProviders: [],
    gameCollections: [],
    favoriteGames: [],
    winnersSubscription: undefined,
    latestWinners: [],
    showMobileGameModal: false,
    mobileGameModalType: undefined,
    mobileGameModalInfo: undefined
  }),

  getters: {
    providersSelectOptions(state):IGameProvider[] {
      return state.gameProviders.map((provider) => ({
        ...provider,
        code: provider.id,
        value: provider.name,
      }));
    },
    currentLocationCollections(state):ICollection[] {
      const globalStore = useGlobalStore();

      if (!globalStore.headerCountry) return state.gameCollections;

      return state.gameCollections.filter((collection) => {
        return !collection.countries.length || collection.countries.includes(globalStore.headerCountry as string);
      })
    },
  },

  actions: {
    async getGameProviders(): Promise<void> {
      const { getGameProviders } = useCoreGamesApi();
      const data = await getGameProviders();
      this.gameProviders = data.filter((provider: IGameProvider) => provider.identity !== 'betsy');
    },

    async getGameCollections(): Promise<void> {
      const { getGameCollections } = useCoreGamesApi();
      this.gameCollections = await getGameCollections();
    },

    async getFavoriteGames(): Promise<void> {
      const { getFavorite } = useCoreGamesApi();
      this.favoriteGames = await getFavorite();
    },

    async setFavoriteGame(gameId:string): Promise<void> {
      const { setFavorite } = useCoreGamesApi();
      this.favoriteGames = await setFavorite(gameId);
    },

    async deleteFavoriteGame(gameId:string): Promise<void> {
      const { deleteFavorite } = useCoreGamesApi();
      this.favoriteGames = await deleteFavorite(gameId);
    },

    subscribeWinnersSocket():void {
      const { createSubscription } = useWebSocket();
      const globalStore = useGlobalStore();
      const profileStore = useProfileStore();
      this.winnersSubscription = createSubscription(`game:winners:${globalStore.isMobile ? 'mobile' : 'desktop'}:${profileStore.profile?.country || globalStore.headerCountry || 'UA'}`, this.updateWinners);
    },

    setWinners(winners: IWinner[]):void {
      this.latestWinners = winners.slice(0, 12);
    },

    updateWinners(winnerData:IWebSocketResponse):void {
      const that = this;
      throttle(() => {
        const { winner } = winnerData.data;
        const filteredWinners = that.latestWinners.filter((item) => item.gameId !== winner?.gameId);
        if (winner) that.latestWinners = [winner, ...filteredWinners].slice(0, 12);
      }, 3000, { leading: false })();
    },

    openMobileGameModal(modalType: MobileModalType, gameInfo: IGame):void {
      this.mobileGameModalType = modalType;
      this.mobileGameModalInfo = gameInfo;
      this.showMobileGameModal = true;
    }
  },
});

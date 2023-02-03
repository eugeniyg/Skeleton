import { defineStore } from 'pinia';
import {
  CollectionInterface,
  GameInterface,
  GameProviderInterface,
  WebSocketResponseInterface,
  WinnerInterface,
} from '@platform/frontend-core/dist/module';
import throttle from 'lodash/throttle';
import { useGlobalStore } from '~/composables/useGlobalStore';
import { useProfileStore } from '~/composables/useProfileStore';

interface GamesStoreStateInterface {
  gameProviders: GameProviderInterface[],
  gameCollections: CollectionInterface[],
  favoriteGames: GameInterface[],
  winnersSubscription: any,
  latestWinners: WinnerInterface[],
  betsyParams: {
    host: string,
    cid: string
  },
}

export const useGamesStore = defineStore('gamesStore', {
  state: ():GamesStoreStateInterface => ({
    gameProviders: [],
    gameCollections: [],
    favoriteGames: [],
    winnersSubscription: undefined,
    latestWinners: [],
    betsyParams: {
      host: 'https://turboplatform-dev.betsy.gg',
      cid: 'turboplatform-dev',
    },
  }),

  getters: {
    providersSelectOptions(state):GameProviderInterface[] {
      return state.gameProviders.map((provider) => ({
        ...provider,
        code: provider.id,
        value: provider.name,
      }));
    },
  },

  actions: {
    async getGameProviders(): Promise<void> {
      const { getGameProviders } = useCoreGamesApi();
      const data = await getGameProviders();
      this.gameProviders = data.filter((provider: GameProviderInterface) => provider.identity !== 'betsy');
    },

    async getGameCollections(): Promise<void> {
      const { getGameCollections } = useCoreGamesApi();
      const data = await getGameCollections();
      this.gameCollections = data;
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

    setWinners(winners: WinnerInterface[]):void {
      this.latestWinners = winners.slice(0, 12);
    },

    updateWinners(winnerData:WebSocketResponseInterface):void {
      const that = this;
      throttle(() => {
        const { winner } = winnerData.data;
        const filteredWinners = that.latestWinners.filter((item) => item.gameId !== winner?.gameId);
        if (winner) that.latestWinners = [winner, ...filteredWinners].slice(0, 12);
      }, 3000, { leading: false })();
    },
  },
});

import { defineStore } from 'pinia';
import {
  CollectionInterface,
  GameInterface,
  GameProviderInterface, WebSocketResponseInterface,
} from '@platform/frontend-core/dist/module';

interface GamesStoreStateInterface {
  gameProviders: GameProviderInterface[],
  gameCollections: CollectionInterface[],
  favoriteGames: GameInterface[],
  winnersSubscription: any,
}

export const useGamesStore = defineStore('gamesStore', {
  state: (): GamesStoreStateInterface => ({
      gameProviders: [],
      gameCollections: [],
      // sorted categories for tabs (for MVP will be 8)
      favoriteGames: [],
      winnersSubscription: undefined,
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
      this.winnersSubscription = createSubscription('game:winners', this.updateWinners);
      console.log(this.winnersSubscription);
    },

    unsubscribeWinnersSocket():void {
      if (this.winnersSubscription) {
        this.winnersSubscription.unsubscribe();
        this.winnersSubscription.removeAllListeners();
      }
    },

    updateWinners(webSocketResponse:WebSocketResponseInterface):void {
      console.log('dima');
      console.log(webSocketResponse);
      // const accountData:AccountInterface = webSocketResponse.data.account;
      // this.accounts = this.accounts.map((account) => {
      //   if (account.id === accountData.id) return accountData;
      //   return account;
      // });
    },
  },
});

import { defineStore } from 'pinia';
import {
  CollectionInterface,
  GameInterface,
  GameProviderInterface,
} from '@platform/frontend-core/dist/module';

interface GamesStoreStateInterface {
  gameProviders: GameProviderInterface[];
  gameCollections: CollectionInterface[];
  favoriteGames: GameInterface[];
}

export const useGamesStore = defineStore('gamesStore', {
  state: (): GamesStoreStateInterface => ({
      gameProviders: [],
      gameCollections: [],
      // sorted categories for tabs (for MVP will be 8)
      favoriteGames: [],
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
  },
});

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
  sortedCategories: { [key: string]: string };
}

export const useGamesStore = defineStore('gamesStore', {
  state: (): GamesStoreStateInterface => ({
      gameProviders: [],
      gameCollections: [],
      // sorted categories for tabs (for MVP will be 8)
      sortedCategories: {
        all: 'cherry',
        hot: 'hot',
        slots: 'slots',
        turbogames: 'turbo-games',
        new: 'new',
        table: 'table-games',
        live: 'live-casino',
        popular: 'heart',
      },
      favoriteGames: [],
    }),

  getters: {
    providersSelectOptions(state):GameProviderInterface[] {
      const allProvidersItem = {
        id: 'all',
        name: 'All Providers',
        identity: 'all',
        code: 'all',
        value: 'All Providers',
      };
      const optionsArr = state.gameProviders.map((provider) => ({
        ...provider,
        code: provider.id,
        value: provider.name,
      }));
      return [allProvidersItem, ...optionsArr];
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

      this.gameCollections = data.filter((item) => Object.keys(this.sortedCategories).find((el) => el === item.identity)).sort(
        (a, b) => Object.keys(this.sortedCategories).map((e) => e).indexOf(a.identity)
          - Object.keys(this.sortedCategories).map((e) => e).indexOf(b.identity),
      );
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

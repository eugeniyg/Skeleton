import { defineStore } from 'pinia';
import { useGamesApi } from '~/CORE/index';
import { CollectionInterface, GameInterface, GameProviderInterface } from '~/types/gameTypes';
import { useFieldsStore } from '~/composables/useFieldsStore';

export type GamesStoreStateType = {
  gameProviders: GameProviderInterface[];
  gameCollections: CollectionInterface[];
  favoriteGames: GameInterface[];
  sortedCategories: { [key: string]: string };
};

export const useGamesStore = defineStore('gamesStore', {
  state: () => ({
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
        popular: 'ui-heart',
      },
      favoriteGames: [],
    } as GamesStoreStateType),

  actions: {
    async getGameProviders(): Promise<void> {
      const { getGameProviders } = useGamesApi();
      const data = await getGameProviders();
      this.gameProviders = data.filter((provider: GameProviderInterface) => provider.identity !== 'betsy');
      const { setOptions } = useFieldsStore();
      setOptions('providers', this.gameProviders);
    },

    async getGameCollections(): Promise<void> {
      const { getGameCollections } = useGamesApi();
      const data = await getGameCollections();

      this.gameCollections = data.filter((item) => Object.keys(this.sortedCategories).find((el) => el === item.identity)).sort(
        (a, b) => Object.keys(this.sortedCategories).map((e) => e).indexOf(a.identity)
          - Object.keys(this.sortedCategories).map((e) => e).indexOf(b.identity),
      );
    },

    async getFavoriteGames(): Promise<void> {
      const { getFavorite } = useGamesApi();
      this.favoriteGames = await getFavorite();
    },

    async setFavoriteGame(gameId:string): Promise<void> {
      const { setFavorite } = useGamesApi();
      this.favoriteGames = await setFavorite(gameId);
    },

    async deleteFavoriteGame(gameId:string): Promise<void> {
      const { deleteFavorite } = useGamesApi();
      this.favoriteGames = await deleteFavorite(gameId);
    },
  },
});

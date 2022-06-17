import { defineStore } from 'pinia';
import { useGamesApi } from '~/CORE/index';
import { CollectionInterface, GameProviderInterface } from '~/types/gameTypes';
import { useFieldsStore } from '~/composables/useFieldsStore';

export type GamesStoreStateType = {
  gameProviders: GameProviderInterface[];
  gameCollections: CollectionInterface[];
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
        new: 'new',
        table: 'table-games',
        turbogames: 'turbo-games',
        live: 'live-casino',
        popular: 'ui-heart',
      },
    } as GamesStoreStateType),

  actions: {
    async getGameProviders(): Promise<void> {
      const { getGameProviders } = useGamesApi();
      const data = await getGameProviders();
      this.gameProviders = data;
      const { setOptions } = useFieldsStore();
      setOptions('providers', data);
    },

    async getGameCollections(): Promise<void> {
      const { getGameCollections } = useGamesApi();
      const data = await getGameCollections();

      this.gameCollections = data.filter((item) => Object.keys(this.sortedCategories).find((el) => el === item.identity)).sort(
        (a, b) => Object.keys(this.sortedCategories).map((e) => e).indexOf(a.identity)
          - Object.keys(this.sortedCategories).map((e) => e).indexOf(b.identity),
      );
    },
  },
});

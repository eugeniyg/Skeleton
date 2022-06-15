import { defineStore } from 'pinia';
import { useGamesApi } from '~/CORE/index';
import { CollectionInterface, GameProviderInterface } from '~/types/gameTypes';
import { useFieldsStore } from '~/composables/useFieldsStore';

export type GamesStoreStateType = {
  gameProviders: GameProviderInterface[];
  gameCollections: CollectionInterface[];
  sortedCategories: { id: string; icon: string }[];
};

export const useGamesStore = defineStore('gamesStore', {
  state: () => ({
      gameProviders: [],
      gameCollections: [],
      sortedCategories: [
        { id: 'all', icon: 'cherry' },
        { id: 'hot', icon: 'hot' },
        { id: 'slots', icon: 'slots' },
        { id: 'new', icon: 'new' },
        { id: 'table', icon: 'table-games' },
        { id: 'turbogames', icon: 'turbo-games' },
        { id: 'live', icon: 'live-casino' },
        { id: 'popular', icon: 'ui-heart' },
      ],
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

      this.gameCollections = data.sort(
        (a, b) => this.sortedCategories.map((e) => e.id).indexOf(a.identity)
          - this.sortedCategories.map((e) => e.id).indexOf(b.identity),
      );
    },
  },
});

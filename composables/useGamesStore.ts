import { defineStore } from 'pinia';
import { useGamesApi } from '~/CORE/index';
import { CollectionInterface, GameProviderInterface } from '~/types/gameTypes';
import { useFieldsStore } from '~/composables/useFieldsStore';

export type GamesStoreStateType = {
  gameProviders: GameProviderInterface[],
  gameCollections: CollectionInterface[],
}

export const useGamesStore = defineStore('gamesStore', {
  state: () => ({
    gameProviders: [],
    gameCollections: [],
  } as GamesStoreStateType),

  actions: {
    async getGameProviders():Promise<void> {
      const { getGameProviders } = useGamesApi();
      const data = await getGameProviders();
      this.gameProviders = data;
      const { setOptions } = useFieldsStore();
      setOptions('providers', data);
    },

    async getGameCollections():Promise<void> {
      const { getGameCollections } = useGamesApi();
      const data = await getGameCollections();
      this.gameCollections = data;
    },
  },
});

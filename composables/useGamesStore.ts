import { defineStore } from 'pinia';
import { collectionInterface, gameProviderInterface } from '~/types/gameTypes';
import { useFieldsStore } from '~/composables/useFieldsStore';

export type gamesStoreStateType = {
  gameProviders: gameProviderInterface[],
  gameCollections: collectionInterface[],
}

export const useGamesStore = defineStore('gamesStore', {
  state: () => ({
    gameProviders: [],
    gameCollections: [],
  } as gamesStoreStateType),

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

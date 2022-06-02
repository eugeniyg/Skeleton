import { defineStore } from 'pinia';
import { useApiInstance } from './useApiInstance';

export const useGamesApi = defineStore('gamesApi', {
  actions: {
    async getGameCollections():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/game/collections');
      return data;
    },

    async getGameProviders():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/game/providers');
      return data;
    },

    async getFilteredGames(filterParams: any):Promise<any> {
      const { apiInstance } = useApiInstance();
      const data = await apiInstance('/api/game/games', { params: filterParams });
      return data;
    },
  },
});

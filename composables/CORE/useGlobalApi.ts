import { defineStore } from 'pinia';
import { useApiInstance } from './useApiInstance';

export const useGlobalApi = defineStore('globalApi', {
  actions: {
    async getCurrencies():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/settings/currencies');
      return data;
    },

    async getLocales():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/settings/locales');
      return data;
    },

    async getCountries():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/settings/countries');
      return data;
    },

    async getCommonData():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/commons/constants');
      return data;
    },
  },
});

import { defineStore } from 'pinia';
import { useGlobalApi } from '@platform/frontend-core';
import { countryInterface, currencyInterface, localeInterface } from '@/types/globalDataTypes';
import { useFieldsStore } from '~/composables/useFieldsStore';

const {
  getCurrencies,
  getLocales,
  getCountries,
} = useGlobalApi();

export type globalStoreStateType = {
  currencies: currencyInterface[],
  locales: localeInterface[],
  countries: countryInterface[],
}

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    currencies: [],
    locales: [],
    countries: [],
  } as globalStoreStateType),

  actions: {
    async getCurrencies():Promise<void> {
      const { data } = await getCurrencies();
      this.currencies = data;
      const { setOptions } = useFieldsStore();
      setOptions('currency', data);
    },

    async getLocales():Promise<void> {
      const { data } = await getLocales();
      this.locales = data;
    },

    async getCountries():Promise<void> {
      const { data } = await getCountries();
      this.countries = data;
      const { setOptions } = useFieldsStore();
      setOptions('country', data);
    },
  },
});

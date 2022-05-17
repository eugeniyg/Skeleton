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
      const currencies = await getCurrencies();
      this.currencies = currencies;
      const { setOptions } = useFieldsStore();
      setOptions('currency', currencies);
    },

    async getLocales():Promise<void> {
      const locales = await getLocales();
      this.locales = locales;
    },

    async getCountries():Promise<void> {
      const countries = await getCountries();
      this.countries = countries;
      const { setOptions } = useFieldsStore();
      setOptions('country', countries);
    },
  },
});

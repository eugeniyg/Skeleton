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
  validationMessages: any,
}

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    currencies: [],
    locales: [],
    countries: [],
    validationMessages: {},
  } as globalStoreStateType),

  actions: {
    async getCurrencies():Promise<void> {
      const currencies = await getCurrencies();
      this.currencies = currencies;
      const { setOptions } = useFieldsStore();
      setOptions('currency', currencies);
    },

    async getLocales():Promise<void> {
      this.locales = await getLocales();
    },

    async getCountries():Promise<void> {
      const countries = await getCountries();
      this.countries = countries;
      const { setOptions } = useFieldsStore();
      setOptions('country', countries);
    },

    async getValidationMessages():Promise<void> {
      this.validationMessages = await $fetch('/api/content/validation-message');
    },
  },
});

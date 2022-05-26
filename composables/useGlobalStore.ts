import { defineStore } from 'pinia';
import { useGlobalApi } from '@platform/frontend-core';
import {
 countryInterface, currencyInterface, localeInterface, timeZoneInterface,
} from '@/types/globalDataTypes';
import { useFieldsStore } from '~/composables/useFieldsStore';

export type globalStoreStateType = {
  currencies: currencyInterface[],
  locales: localeInterface[],
  countries: countryInterface[],
  validationMessages: any,
  timeZones: timeZoneInterface[],
}

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    currencies: [],
    locales: [],
    countries: [],
    validationMessages: {},
    timeZones: [],
  } as globalStoreStateType),

  actions: {
    async getCurrencies():Promise<void> {
      const { getCurrencies } = useGlobalApi();
      const currencies = await getCurrencies();
      this.currencies = currencies;
      const { setOptions } = useFieldsStore();
      setOptions('currency', currencies);
    },

    async getLocales():Promise<void> {
      const { getLocales } = useGlobalApi();
      this.locales = await getLocales();
    },

    async getCountries():Promise<void> {
      const { getCountries } = useGlobalApi();
      const countries = await getCountries();
      this.countries = countries;
      const { setOptions } = useFieldsStore();
      setOptions('country', countries);
    },

    async getCommonData():Promise<void> {
      const { getCommonData } = useGlobalApi();
      const data = await getCommonData();
      this.timeZones = data.timeZone;
      const { setOptions } = useFieldsStore();
      setOptions('timeZone', data.timeZone);
    },

    async getValidationMessages():Promise<void> {
      this.validationMessages = await $fetch('/api/content/validation-message');
    },
  },
});

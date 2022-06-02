import { defineStore } from 'pinia';
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
      const data = await getCurrencies();
      this.currencies = data;
      const { setOptions } = useFieldsStore();
      setOptions('currency', data);
    },

    async getLocales():Promise<void> {
      const { getLocales } = useGlobalApi();
      const data = await getLocales();
      this.locales = data;
    },

    async getCountries():Promise<void> {
      const { getCountries } = useGlobalApi();
      const data = await getCountries();
      this.countries = data;
      const { setOptions } = useFieldsStore();
      setOptions('country', data);
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

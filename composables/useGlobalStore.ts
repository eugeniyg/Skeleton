import { defineStore } from 'pinia';
import { useGlobalApi } from '~/CORE/index';
import {
  BrowserLanguageInterface,
  CountryInterface, CurrencyInterface, LocaleInterface, TimeZoneInterface,
} from '@/types/globalDataTypes';
import { useFieldsStore } from '~/composables/useFieldsStore';

export type GlobalStoreStateType = {
  currencies: CurrencyInterface[],
  locales: LocaleInterface[],
  countries: CountryInterface[],
  validationMessages: any,
  timeZones: TimeZoneInterface[],
  currentLocale: string,
  isMobile: boolean,
  browserLanguage: string,
  fieldsContent: any,
  baseApiUrl: string,
}

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    currencies: [],
    locales: [],
    countries: [],
    validationMessages: {},
    timeZones: [],
    currentLocale: '',
    isMobile: false,
    browserLanguage: 'en',
    fieldsContent: {},
    baseApiUrl: '',
  } as GlobalStoreStateType),

  actions: {
    async getCurrencies():Promise<void> {
      const { getCurrencies } = useGlobalApi();
      const data = await getCurrencies();
      this.currencies = data;
      const { setOptions } = useFieldsStore();
      setOptions('currency', data);
    },

    parseUserAgent(agent: string):void {
      this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(agent.toLowerCase());
    },

    setBrowserLanguage(languages: BrowserLanguageInterface[]):void {
      this.browserLanguage = languages[0].code;
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

    async getFieldsContent():Promise<void> {
      this.fieldsContent = await $fetch('/api/content/fields');
    },
  },
});

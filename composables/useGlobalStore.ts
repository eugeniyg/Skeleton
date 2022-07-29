import { defineStore } from 'pinia';
import {
  BrowserLanguageInterface,
  CountryInterface,
  CurrencyInterface,
  LocaleInterface,
  TimeZoneInterface,
} from '~/CORE/index';
import { useFieldsStore } from '~/composables/useFieldsStore';

export type GlobalStoreStateType = {
  currencies: CurrencyInterface[],
  locales: LocaleInterface[],
  countries: CountryInterface[],
  validationMessages: any,
  timeZones: TimeZoneInterface[],
  defaultLocale: LocaleInterface|undefined,
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
    defaultLocale: undefined,
    isMobile: false,
    browserLanguage: 'en',
    fieldsContent: {},
    baseApiUrl: '',
  } as GlobalStoreStateType),

  getters: {
    currentLocale():LocaleInterface {
      const route = useRoute();
      const findLocale = this.locales.find((locale) => locale.code === route.params.locale);
      if (route.params.locale && findLocale) return findLocale;
      return this.defaultLocale;
    },
  },

  actions: {
    async getCurrencies():Promise<void> {
      const { getCurrencies } = useCoreGlobalApi();
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
      const { getLocales } = useCoreGlobalApi();
      const data = await getLocales();
      this.locales = data;
      this.defaultLocale = data.find((locale) => locale.isDefault);
    },

    async getCountries():Promise<void> {
      const { getCountries } = useCoreGlobalApi();
      const data = await getCountries();
      this.countries = data;
      const { setOptions } = useFieldsStore();
      setOptions('country', data);
    },

    async getCommonData():Promise<void> {
      const { getCommonData } = useCoreGlobalApi();
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

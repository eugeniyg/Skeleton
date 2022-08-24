import { defineStore } from 'pinia';
import {
  CountryInterface,
  CurrencyInterface,
  LocaleInterface,
  TimeZoneInterface,
  InitUserInfoInterface,
} from '@platform/frontend-core/dist/module';
import { BrowserLanguageInterface } from '~/types';

export type GlobalStoreStateType = {
  currencies: CurrencyInterface[],
  locales: LocaleInterface[],
  countries: CountryInterface[],
  timeZones: TimeZoneInterface[],
  defaultLocale: LocaleInterface|undefined,
  isMobile: boolean,
  browserLanguage: string,
  baseApiUrl: string,
  initUserInfo: InitUserInfoInterface,
  validationMessages: any,
  fieldsContent: any,
}

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    currencies: [],
    locales: [],
    countries: [],
    timeZones: [],
    defaultLocale: undefined,
    isMobile: false,
    browserLanguage: 'en',
    baseApiUrl: '',
    initUserInfo: undefined,
    validationMessages: {},
    fieldsContent: {},
  } as GlobalStoreStateType),

  getters: {
    currentLocale():LocaleInterface {
      const route = useRoute();
      const findLocale = this.locales.find((locale) => locale.code === route.params.locale);
      if (route.params.locale && findLocale) return findLocale;
      return this.defaultLocale;
    },
    currenciesSelectOptions():CurrencyInterface[] {
      return this.currencies.map((currency) => ({ ...currency, value: currency.code }));
    },
    countriesSelectOptions():CountryInterface[] {
      return this.countries.map((country) => ({
        ...country,
        value: country.name,
        mask: `/img/flags/${country.code.toLowerCase()}.svg`,
      }));
    },
    timeZonesSelectOptions():TimeZoneInterface[] {
      return this.timeZones.map((zone) => ({
        ...zone,
        code: zone.id,
        value: zone.name,
      }));
    },
  },

  actions: {
    async getCurrencies():Promise<void> {
      const { getCurrencies } = useCoreGlobalApi();
      const data = await getCurrencies();
      this.currencies = data;
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
    },

    async getCommonData():Promise<void> {
      const { getCommonData } = useCoreGlobalApi();
      const data = await getCommonData();
      this.timeZones = data.timeZone;
    },

    async getInitUserInformation():Promise<void> {
      const { getInitUserInfo } = useCoreGlobalApi();
      const data = await getInitUserInfo();
      this.initUserInfo = data;
    },

    async getGlobalContent():Promise<void> {
      const [validations, fieldsData] = await Promise.allSettled([
        queryContent(`validations/${this.currentLocale.code}`).findOne(),
        queryContent(`fields/${this.currentLocale.code}`).findOne(),
      ]);
      if (validations.status !== 'rejected') this.validationMessages = validations.value;
      if (fieldsData.status !== 'rejected') this.fieldsContent = fieldsData.value;
    },
  },
});

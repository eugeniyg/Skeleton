import camelCase from 'lodash/camelCase';
import {defineStore} from 'pinia';
import type {
  ICoreConstants,
  ICountry,
  ICurrency,
  ILocale,
  IStatus,
  ITimeZone
} from '@skeleton/core/types';
import type {
  IAlertsContent,
  ICategory,
  IFieldsSettingsContent,
  IGlobalComponentsContent,
  IGlobalSeo,
  ILayoutContent,
  IModalsContent
} from "~/types";
import type { IBrowserLanguage } from "@skeleton/types";

interface IGlobalContent {
  alerts: IAlertsContent;
  fieldsSettings: IFieldsSettingsContent;
  globalComponents: IGlobalComponentsContent;
  layout: ILayoutContent;
  modals: IModalsContent;
}

interface IGlobalStoreState {
  currencies: ICurrency[],
  baseCurrency: Maybe<ICurrency>,
  equivalentCurrency: Maybe<ICurrency>,
  locales: ILocale[],
  currentLocale: Maybe<ILocale>,
  countries: ICountry[],
  settingsConstants: Maybe<ICoreConstants>,
  defaultLocale: Maybe<ILocale>,
  isMobile: boolean,
  browserLanguage: string,
  baseApiUrl: string,
  fieldsSettings: Maybe<IFieldsSettingsContent>,
  defaultLocaleFieldsSettings: Maybe<IFieldsSettingsContent>,
  layoutData: Maybe<ILayoutContent>,
  defaultLocaleLayoutData: Maybe<ILayoutContent>,
  popupsData: Maybe<IModalsContent>,
  defaultLocalePopupsData: Maybe<IModalsContent>,
  alertsData: Maybe<IAlertsContent>,
  defaultLocaleAlertsData: Maybe<IAlertsContent>,
  globalComponentsContent: Maybe<IGlobalComponentsContent>,
  defaultLocaleGlobalComponentsContent: Maybe<IGlobalComponentsContent>,
  countryHeaderName: string,
  headerCountry: Maybe<string>,
  pagesWithoutLocale: string[]
}

export const useGlobalStore = defineStore('globalStore', {
  state: ():IGlobalStoreState => ({
    currencies: [],
    baseCurrency: undefined,
    equivalentCurrency: undefined,
    locales: [],
    currentLocale: undefined,
    countries: [],
    settingsConstants: undefined,
    defaultLocale: undefined,
    isMobile: false,
    browserLanguage: 'en',
    baseApiUrl: '',
    fieldsSettings: undefined,
    defaultLocaleFieldsSettings: undefined,
    layoutData: undefined,
    defaultLocaleLayoutData: undefined,
    popupsData: undefined,
    defaultLocalePopupsData: undefined,
    alertsData: undefined,
    defaultLocaleAlertsData: undefined,
    globalComponentsContent: undefined,
    defaultLocaleGlobalComponentsContent: undefined,
    countryHeaderName: 'cf-ipcountry',
    headerCountry: undefined,
    pagesWithoutLocale: [
      'verify-confirmCode',
      'locale-verify-confirmCode',
      'password-reset-resetCode',
      'locale-password-reset-resetCode',
      'questions',
      'locale-questions'
    ]
  }),

  getters: {
    fiatCurrencies(state):ICurrency[] {
      return state.currencies.filter((currency) => currency.type === 'fiat');
    },

    cryptoCurrencies(state): ICurrency[] {
      return state.currencies.filter((currency) => currency.type === 'crypto');
    },

    currenciesSelectOptions(state):ICurrency[] {
      return state.currencies.map((currency) => ({ ...currency, value: currency.code }));
    },

    countriesSelectOptions(state):ICountry[] {
      return state.countries.map((country) => ({
        ...country,
        value: country.name,
        mask: `/img/flags/${country.code.toLowerCase()}.svg`,
      }));
    },

    timeZonesSelectOptions(state):ITimeZone[] {
      const zonesArr = state.settingsConstants?.player.timeZone.map((zone) => ({
        ...zone,
        code: zone.id,
        value: zone.name,
      }));
      return zonesArr || [];
    },

    gameCategoriesObj(state):{ [key: string]: ICategory } {
      const categoriesObj:any = {};

      const categoriesContent = state.globalComponentsContent?.categories?.categoriesList
          || state.defaultLocaleGlobalComponentsContent?.categories?.categoriesList;

      if (categoriesContent) {
        categoriesContent.forEach((category) => {
          categoriesObj[category.identity] = category;
        });
      }
      return categoriesObj;
    },

    globalSeo(state): Maybe<IGlobalSeo> {
      return state.globalComponentsContent?.globalSeo || state.defaultLocaleGlobalComponentsContent?.globalSeo;
    },

    playerStatuses(state):IStatus[] {
      return state.settingsConstants?.player.playerStatuses || [];
    },

    invoiceStatuses(state):IStatus[] {
      return state.settingsConstants?.payment.invoiceStatuses || [];
    },

    invoiceTypes(state):IStatus[] {
      return state.settingsConstants?.payment.invoiceTypes || [];
    },

    betStatuses(state):IStatus[] {
      return state.settingsConstants?.game.bet.status || [];
    },

    documentStatuses(state):IStatus[] {
      return state.settingsConstants?.player.document.status || [];
    },

    bonusesStatuses(state):IStatus[] {
      return state.settingsConstants?.game.playerBonus.status || [];
    },

    bonusesResults(state):IStatus[] {
      return state.settingsConstants?.game.playerBonus.result || [];
    },

    freeSpinsStatuses(state):IStatus[] {
      return state.settingsConstants?.game.playerFreespin.status || [];
    },

    freeSpinsResults(state):IStatus[] {
      return state.settingsConstants?.game.playerFreespin.result || [];
    },

    isIOSPlatform():boolean|null {
      if (!window?.navigator?.platform && !window?.navigator?.userAgent) return null;

      return /iPad|iPhone|iPod/.test(window.navigator.platform)
        || /iPad|iPhone|iPod/.test(window.navigator.userAgent);
    },

    osPlatform():string|null {
      const userAgent = window.navigator.userAgent;
      // @ts-ignore
      const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
      const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'macOS'];
      const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
      const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

      let os = null;
      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
      } else if (/Android/.test(userAgent)) {
        os = 'Android';
      } else if (/Linux/.test(platform)) {
        os = 'Linux';
      }

      return os;
    }
  },

  actions: {
    async getCurrencies():Promise<void> {
      const { getCurrencies } = useCoreGlobalApi();
      const data = await getCurrencies(1);
      this.currencies = data.filter((currency) => currency.isEnabled);
      this.baseCurrency = data.find((currency) => currency.isBase);
    },

    parseUserAgent(agent: string):void {
      this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(agent.toLowerCase());
    },

    setBrowserLanguage(languages: IBrowserLanguage[]):void {
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
      this.countries = await getCountries();
    },

    async getSettingsConstants():Promise<void> {
      const { getCoreConstants } = useCoreGlobalApi();
      this.settingsConstants = await getCoreConstants();
    },

    setCurrentLocale() {
      const cookieLanguage = useCookie('user-language');

      if (cookieLanguage.value) {
        const cookieLanguageData = this.locales.find(locale => locale.code === cookieLanguage.value);
        this.currentLocale = cookieLanguageData ?? this.defaultLocale;
      } else {
        const geoCountry = this.countries.find(country => country.code.toUpperCase() === this.headerCountry?.toUpperCase());
        const geoLocaleData = this.locales.find(locale => locale.code === geoCountry?.locale);
        this.currentLocale = geoLocaleData ?? this.defaultLocale;
      }
    },

    async getGlobalContent():Promise<void> {
      const globalContentFolders = ['alerts', 'fields-settings', 'global-components', 'layout', 'modals'];

      const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
        queryContent(this.currentLocale?.code as string).where({ _dir: { $in: globalContentFolders } }).find(),
        this.currentLocale?.isDefault
          ? Promise.reject('Current locale is default locale!')
          : queryContent(this.defaultLocale?.code as string).where({ _dir: { $in: globalContentFolders } }).find()
      ]);

      const { getLocalesContentData } = useProjectMethods();
      const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);

      if (currentLocaleData) {
        const formattedCurrentLocaleContent: IGlobalContent = currentLocaleData.reduce((finalContentObj:any, currentContent:any) => {
          const splitPath = currentContent._path?.split('/');
          if (!splitPath) return finalContentObj;

          const collection = camelCase(splitPath[2]);
          const contentName = camelCase(splitPath[3]);
          return { ...finalContentObj, [collection]: { ...finalContentObj[collection], [contentName]: currentContent } }
        }, {})

        this.fieldsSettings = formattedCurrentLocaleContent.fieldsSettings;
        this.layoutData = formattedCurrentLocaleContent.layout;
        this.popupsData = formattedCurrentLocaleContent.modals;
        this.alertsData = formattedCurrentLocaleContent.alerts;
        this.globalComponentsContent = formattedCurrentLocaleContent.globalComponents;
      }

      if (defaultLocaleData) {
        const formattedDefaultLocaleContent: IGlobalContent = defaultLocaleData.reduce((finalContentObj:any, currentContent:any) => {
          const splitPath = currentContent._path?.split('/');
          if (!splitPath) return finalContentObj;

          const collection = camelCase(splitPath[2]);
          const contentName = camelCase(splitPath[3]);
          return { ...finalContentObj, [collection]: { ...finalContentObj[collection], [contentName]: currentContent } }
        }, {})

        this.defaultLocaleFieldsSettings = formattedDefaultLocaleContent.fieldsSettings;
        this.defaultLocaleLayoutData = formattedDefaultLocaleContent.layout;
        this.defaultLocalePopupsData = formattedDefaultLocaleContent.modals;
        this.defaultLocaleAlertsData = formattedDefaultLocaleContent.alerts;
        this.defaultLocaleGlobalComponentsContent = formattedDefaultLocaleContent.globalComponents;
      }
    },

    getRequestCountry():void {
      const headersCountry:Record<string, any> = useRequestHeaders([this.countryHeaderName]);
      if (headersCountry[this.countryHeaderName]) this.headerCountry = headersCountry[this.countryHeaderName]?.toUpperCase();
    },

    setEquivalentCurrency(currencyCode: string):void {
      this.equivalentCurrency = this.currencies.find((currency) => currency.code === currencyCode);
      if (this.equivalentCurrency) localStorage.setItem('equivalentCurrency', this.equivalentCurrency.code);
    },

    removeEquivalentCurrency():void {
      localStorage.removeItem('equivalentCurrency');
      this.equivalentCurrency = undefined;
    },
  },
});

import camelCase from 'lodash/camelCase';
import type { ICoreConstants, ICountry, ICurrency, ILocale, IStatus, ITimeZone } from '@skeleton/api/types';
import type {
  IAlertsContent,
  ICategory,
  IFieldsSettingsContent,
  IGlobalComponentsContent,
  IGlobalSeo,
  ILayoutContent,
  IModalsContent,
} from '~/types';
import type { IBrowserLanguage } from '@skeleton/types';
import {
  getCurrencies as requestCurrencies,
  getLocales as requestLocales,
  getCountries as requestCountries,
  getConstants,
} from '@skeleton/api/global';
import { getLocalesContentData } from '@skeleton/helpers/contentMethods';
import type { CollectionItemBase, Collections } from '@nuxt/content';
type CollectionKey = keyof Collections;

interface IGlobalStoreState {
  currencies: ICurrency[];
  baseCurrency: Maybe<ICurrency>;
  equivalentCurrency: Maybe<ICurrency>;
  locales: ILocale[];
  currentLocale: Maybe<ILocale>;
  countries: ICountry[];
  settingsConstants: Maybe<ICoreConstants>;
  defaultLocale: Maybe<ILocale>;
  isMobile: boolean;
  browserLanguage: string;
  fieldsSettings: Maybe<IFieldsSettingsContent>;
  defaultLocaleFieldsSettings: Maybe<IFieldsSettingsContent>;
  layoutData: Maybe<ILayoutContent>;
  defaultLocaleLayoutData: Maybe<ILayoutContent>;
  alertsData: Maybe<IAlertsContent>;
  defaultLocaleAlertsData: Maybe<IAlertsContent>;
  globalComponentsContent: Maybe<IGlobalComponentsContent>;
  defaultLocaleGlobalComponentsContent: Maybe<IGlobalComponentsContent>;
  currentLocaleModalsContent: Maybe<IModalsContent>;
  defaultLocaleModalsContent: Maybe<IModalsContent>;
  countryHeaderName: string;
  clientIpName: string;
  headerCountry: Maybe<string>;
  headerIp: Maybe<string>;
  pagesWithoutLocale: string[];
}

export const useGlobalStore = defineStore('globalStore', {
  state: (): IGlobalStoreState => ({
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
    fieldsSettings: undefined,
    defaultLocaleFieldsSettings: undefined,
    layoutData: undefined,
    defaultLocaleLayoutData: undefined,
    alertsData: undefined,
    defaultLocaleAlertsData: undefined,
    globalComponentsContent: undefined,
    defaultLocaleGlobalComponentsContent: undefined,
    currentLocaleModalsContent: undefined,
    defaultLocaleModalsContent: undefined,
    countryHeaderName: 'cf-ipcountry',
    clientIpName: 'cf-connecting-ip',
    headerCountry: undefined,
    headerIp: undefined,
    pagesWithoutLocale: [
      'verify-confirmCode',
      'locale-verify-confirmCode',
      'password-reset-resetCode',
      'locale-password-reset-resetCode',
      'questions',
      'locale-questions',
    ],
  }),

  getters: {
    fiatCurrencies(state): ICurrency[] {
      return state.currencies.filter(currency => currency.type === 'fiat');
    },

    cryptoCurrencies(state): ICurrency[] {
      return state.currencies.filter(currency => currency.type === 'crypto');
    },

    currenciesSelectOptions(state): ICurrency[] {
      return state.currencies.map(currency => ({ ...currency, value: currency.code }));
    },

    countriesSelectOptions(state): ICountry[] {
      return state.countries.map(country => ({
        ...country,
        value: country.name,
        mask: `/img/flags/${country.code.toLowerCase()}.svg`,
      }));
    },

    timeZonesSelectOptions(state): ITimeZone[] {
      const zonesArr = state.settingsConstants?.player.timeZone.map(zone => ({
        ...zone,
        code: zone.id,
        value: zone.name,
      }));
      return zonesArr || [];
    },

    gameCategoriesObj(state): { [key: string]: ICategory } {
      const categoriesObj: any = {};

      const categoriesContent =
        state.globalComponentsContent?.categories?.categoriesList ||
        state.defaultLocaleGlobalComponentsContent?.categories?.categoriesList;

      if (categoriesContent) {
        categoriesContent.forEach(category => {
          categoriesObj[category.identity] = category;
        });
      }
      return categoriesObj;
    },

    globalSeo(state): Maybe<IGlobalSeo> {
      return state.globalComponentsContent?.globalSeo || state.defaultLocaleGlobalComponentsContent?.globalSeo;
    },

    playerStatuses(state): IStatus[] {
      return state.settingsConstants?.player.playerStatuses || [];
    },

    invoiceStatuses(state): IStatus[] {
      return state.settingsConstants?.payment.invoiceStatuses || [];
    },

    invoiceTypes(state): IStatus[] {
      return state.settingsConstants?.payment.invoiceTypes || [];
    },

    betStatuses(state): IStatus[] {
      return state.settingsConstants?.game.bet.status || [];
    },

    documentStatuses(state): IStatus[] {
      return state.settingsConstants?.player.document.status || [];
    },

    bonusesStatuses(state): IStatus[] {
      return state.settingsConstants?.game.playerBonus.status || [];
    },

    bonusesResults(state): IStatus[] {
      return state.settingsConstants?.game.playerBonus.result || [];
    },

    freeSpinsStatuses(state): IStatus[] {
      return state.settingsConstants?.game.playerFreespin.status || [];
    },

    freeSpinsResults(state): IStatus[] {
      return state.settingsConstants?.game.playerFreespin.result || [];
    },

    isIOSPlatform(): boolean | null {
      if (!window?.navigator?.platform && !window?.navigator?.userAgent) return null;

      return /iPad|iPhone|iPod/.test(window.navigator.platform) || /iPad|iPhone|iPod/.test(window.navigator.userAgent);
    },

    osPlatform(): string | null {
      const userAgent = window.navigator.userAgent;
      // @ts-expect-error - Navigator type
      const platform = window.navigator?.userAgentData?.platform || window.navigator?.platform;
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
    },
  },

  actions: {
    async getCurrencies(cache?: ICurrency[]): Promise<ICurrency[]> {
      const data = cache ?? (await requestCurrencies(1));
      this.currencies = data.filter(currency => currency.isEnabled);
      this.baseCurrency = data.find(currency => currency.isBase);
      return this.currencies;
    },

    parseUserAgent(agent: string): void {
      this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(agent.toLowerCase());
    },

    setBrowserLanguage(languages: IBrowserLanguage[]): void {
      this.browserLanguage = languages[0].code;
    },

    async getLocales(cache?: ILocale[]): Promise<ILocale[]> {
      const data = cache ?? (await requestLocales());
      this.locales = data;
      this.defaultLocale = data.find(locale => locale.isDefault);
      return data;
    },

    async getCountries(cache?: ICountry[]): Promise<ICountry[]> {
      // TEMPORARY SOLUTION
      const disabledCountries = ['US', 'UM', 'GB', 'FR', 'NL', 'AW', 'CW', 'MF'];
      const responseCountries = cache ?? (await requestCountries());
      this.countries = responseCountries.filter(country => !disabledCountries.includes(country.code));
      return this.countries;
    },

    async getSettingsConstants(cache?: ICoreConstants): Promise<ICoreConstants> {
      this.settingsConstants = cache ?? (await getConstants());
      return this.settingsConstants;
    },

    setCurrentLocale() {
      const cookieLanguage = useCookie('user-language');

      if (cookieLanguage.value) {
        const cookieLanguageData = this.locales.find(locale => locale.code === cookieLanguage.value);
        this.currentLocale = cookieLanguageData ?? this.defaultLocale;
      } else {
        const geoCountry = this.countries.find(
          country => country.code.toUpperCase() === this.headerCountry?.toUpperCase()
        );
        const geoLocaleData = this.locales.find(locale => locale.code === geoCountry?.locale);
        this.currentLocale = geoLocaleData ?? this.defaultLocale;
      }
    },

    async getGlobalContent(): Promise<void> {
      const globalContentCollections = ['alerts', 'fields-settings', 'global-components', 'layout', 'modals'];
      const currentLocaleContentPromises = globalContentCollections.map(collection => {
        const collectionName = camelCase(`${this.currentLocale?.code}-${collection}`);
        return queryCollection(collectionName as CollectionKey).all();
      });

      let defaultLocaleContentPromises: unknown[] = [];
      if (this.currentLocale?.isDefault) {
        defaultLocaleContentPromises = globalContentCollections.map(collection => {
          const collectionName = camelCase(`${this.defaultLocale?.code}-${collection}`);
          return queryCollection(collectionName as CollectionKey).all();
        });
      }

      const [
        currentLocaleAlertsResponse,
        currentLocaleFieldsSettingsResponse,
        currentLocaleGlobalComponentsResponse,
        currentLocaleLayoutResponse,
        currentLocaleModalsResponse,
        defaultLocaleAlertsResponse,
        defaultLocaleFieldsSettingsResponse,
        defaultLocaleGlobalComponentsResponse,
        defaultLocaleLayoutResponse,
        defaultLocaleModalsResponse,
      ] = await Promise.allSettled([...currentLocaleContentPromises, ...defaultLocaleContentPromises]);

      const formatData = <T>(data: CollectionItemBase[] | undefined): T | undefined => {
        if (!data) return;

        const contentData: { [key: string]: any } = {};
        data.forEach(collectionItem => {
          const splitPath = collectionItem.stem.split('/');
          const contentName = camelCase(splitPath[2]);
          contentData[contentName] = collectionItem.meta.body;
        });
        return contentData as T;
      };

      const { currentLocaleData: currentLocaleAlerts, defaultLocaleData: defaultLocaleAlerts } = getLocalesContentData(
        currentLocaleAlertsResponse,
        defaultLocaleAlertsResponse
      );
      this.alertsData = formatData<IAlertsContent>(currentLocaleAlerts);
      this.defaultLocaleAlertsData = formatData<IAlertsContent>(defaultLocaleAlerts);

      const { currentLocaleData: currentLocaleFieldsSettings, defaultLocaleData: defaultLocaleFieldsSettings } =
        getLocalesContentData(currentLocaleFieldsSettingsResponse, defaultLocaleFieldsSettingsResponse);
      this.fieldsSettings = formatData<IFieldsSettingsContent>(currentLocaleFieldsSettings);
      this.defaultLocaleFieldsSettings = formatData<IFieldsSettingsContent>(defaultLocaleFieldsSettings);

      const { currentLocaleData: currentLocaleGlobalComponents, defaultLocaleData: defaultLocaleGlobalComponents } =
        getLocalesContentData(currentLocaleGlobalComponentsResponse, defaultLocaleGlobalComponentsResponse);
      this.globalComponentsContent = formatData<IGlobalComponentsContent>(currentLocaleGlobalComponents);
      this.defaultLocaleGlobalComponentsContent = formatData<IGlobalComponentsContent>(defaultLocaleGlobalComponents);

      const { currentLocaleData: currentLocaleLayout, defaultLocaleData: defaultLocaleLayout } = getLocalesContentData(
        currentLocaleLayoutResponse,
        defaultLocaleLayoutResponse
      );
      this.layoutData = formatData<ILayoutContent>(currentLocaleLayout);
      this.defaultLocaleLayoutData = formatData<ILayoutContent>(defaultLocaleLayout);

      const { currentLocaleData: currentLocaleModals, defaultLocaleData: defaultLocaleModals } = getLocalesContentData(
        currentLocaleModalsResponse,
        defaultLocaleModalsResponse
      );
      this.currentLocaleModalsContent = formatData<IModalsContent>(currentLocaleModals);
      this.defaultLocaleModalsContent = formatData<IModalsContent>(defaultLocaleModals);
    },

    getRequestCountry(): void {
      const headersCountry: Record<string, any> = useRequestHeaders([this.countryHeaderName]);
      const headerIp: Record<string, any> = useRequestHeaders([this.clientIpName]);
      if (headersCountry[this.countryHeaderName])
        this.headerCountry = headersCountry[this.countryHeaderName]?.toUpperCase();
      if (headerIp[this.clientIpName]) this.headerIp = headerIp[this.clientIpName];
    },

    setEquivalentCurrency(currencyCode: string): void {
      this.equivalentCurrency = this.currencies.find(currency => currency.code === currencyCode);
      if (this.equivalentCurrency) localStorage.setItem('equivalentCurrency', this.equivalentCurrency.code);
    },

    removeEquivalentCurrency(): void {
      localStorage.removeItem('equivalentCurrency');
      this.equivalentCurrency = undefined;
    },
  },
});

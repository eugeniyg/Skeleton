import { defineStore } from 'pinia';
import {
  CountryInterface,
  CurrencyInterface,
  LocaleInterface,
  TimeZoneInterface,
  InitUserInfoInterface,
} from '@platform/frontend-core/dist/module';
import {
  AlertsListInterface,
  BrowserLanguageInterface,
  CookiePopupInterface,
  FieldsContentInterface,
  FooterInterface,
  GameCategoryInterface,
  GlobalComponentsInterface,
  HeaderInterface,
  MainLayoutInterface,
  MobileMenuInterface,
  PopupsInterface,
  SeoContentInterface,
  SiteSidebarInterface,
  UserNavigationInterface,
  ValidationMessageInterface,
} from '~/types';

interface GlobalStoreStateInterface {
  currencies: CurrencyInterface[],
  locales: LocaleInterface[],
  countries: CountryInterface[],
  timeZones: TimeZoneInterface[],
  defaultLocale: LocaleInterface|undefined,
  isMobile: boolean,
  browserLanguage: string,
  baseApiUrl: string,
  initUserInfo: InitUserInfoInterface,
  validationMessages: ValidationMessageInterface|{},
  fieldsContent: FieldsContentInterface|{},
  layoutData: MainLayoutInterface,
  popupsData: PopupsInterface|undefined,
  alertsData: AlertsListInterface|undefined,
  globalComponentsContent: GlobalComponentsInterface|undefined,
}

export const useGlobalStore = defineStore('globalStore', {
  state: ():GlobalStoreStateInterface => ({
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
      layoutData: undefined,
      popupsData: undefined,
      alertsData: undefined,
      globalComponentsContent: undefined,
    }),

  getters: {
    currentLocale(state):LocaleInterface {
      const route = useRoute();
      const findLocale = state.locales.find((locale) => locale.code === route.params.locale);
      if (route.params.locale && findLocale) return findLocale;
      return state.defaultLocale;
    },
    currenciesSelectOptions(state):CurrencyInterface[] {
      return state.currencies.map((currency) => ({ ...currency, value: currency.code }));
    },
    countriesSelectOptions(state):CountryInterface[] {
      return state.countries.map((country) => ({
        ...country,
        value: country.name,
        mask: `/img/flags/${country.code.toLowerCase()}.svg`,
      }));
    },
    timeZonesSelectOptions(state):TimeZoneInterface[] {
      return state.timeZones.map((zone) => ({
        ...zone,
        code: zone.id,
        value: zone.name,
      }));
    },
    headerContent(state): HeaderInterface {
      return state.layoutData?.header;
    },
    sidebarContent(state):SiteSidebarInterface {
      return state.layoutData?.siteSidebar;
    },
    userNavigationContent(state):UserNavigationInterface {
      return state.layoutData?.userNavigation;
    },
    footerContent(state):FooterInterface {
      return state.layoutData?.footer;
    },
    cookiePopupContent(state):CookiePopupInterface {
      return state.layoutData?.cookiePopup;
    },
    mobileMenuContent(state):MobileMenuInterface {
      return state.layoutData?.mobileMenu;
    },
    gameCategoriesObj(state):{ [key: string]: GameCategoryInterface } {
      const categoriesObj = {};
      if (state.globalComponentsContent?.categories) {
        state.globalComponentsContent?.categories.forEach((category) => {
          categoriesObj[category.identity] = category;
        });
      }
      return categoriesObj;
    },
    globalSeo(state):SeoContentInterface|undefined {
      return state.globalComponentsContent?.globalSeo;
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
      const [validations, fieldsData, layoutData, popupsData, alertsData, globalContent] = await Promise.allSettled([
        queryContent(`validations/${this.currentLocale.code}`).findOne(),
        queryContent(`fields/${this.currentLocale.code}`).findOne(),
        queryContent(`main-layout/${this.currentLocale.code}`).findOne(),
        queryContent(`popups/${this.currentLocale.code}`).findOne(),
        queryContent(`alerts/${this.currentLocale.code}`).findOne(),
        queryContent(`global-components/${this.currentLocale.code}`).findOne(),
      ]);
      if (validations.status !== 'rejected') this.validationMessages = validations.value;
      if (fieldsData.status !== 'rejected') this.fieldsContent = fieldsData.value;
      if (layoutData.status !== 'rejected') this.layoutData = layoutData.value;
      if (popupsData.status !== 'rejected') this.popupsData = popupsData.value;
      if (alertsData.status !== 'rejected') this.alertsData = alertsData.value;
      if (globalContent.status !== 'rejected') this.globalComponentsContent = globalContent.value;
    },
  },
});

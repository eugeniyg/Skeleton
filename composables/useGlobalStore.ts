import { defineStore } from 'pinia';
import {
  CoreConstantsInterface,
  CountryInterface,
  CurrencyInterface,
  LocaleInterface, StatusInterface,
  TimeZoneInterface,
} from '@platform/frontend-core/dist/module';
import {
  AlertsListInterface,
  BrowserLanguageInterface,
  CookiePopupInterface,
  ErrorPageInterface,
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
  settingsConstants: CoreConstantsInterface|undefined,
  defaultLocale: LocaleInterface|undefined,
  isMobile: boolean,
  browserLanguage: string,
  baseApiUrl: string,
  validationMessages: ValidationMessageInterface|{},
  fieldsContent: FieldsContentInterface|undefined,
  layoutData: MainLayoutInterface|undefined,
  popupsData: PopupsInterface|undefined,
  alertsData: AlertsListInterface|undefined,
  globalComponentsContent: GlobalComponentsInterface|undefined,
  headerCountry: string|undefined,
  pagesWithoutLocale: string[],
  errorPageContent: ErrorPageInterface|undefined,
}

export const useGlobalStore = defineStore('globalStore', {
  state: ():GlobalStoreStateInterface => ({
      currencies: [],
      locales: [],
      countries: [],
      settingsConstants: undefined,
      defaultLocale: undefined,
      isMobile: false,
      browserLanguage: 'en',
      baseApiUrl: '',
      validationMessages: {},
      fieldsContent: undefined,
      layoutData: undefined,
      popupsData: undefined,
      alertsData: undefined,
      globalComponentsContent: undefined,
      headerCountry: undefined,
      pagesWithoutLocale: [
        'verify-confirmCode',
        'locale-verify-confirmCode',
        'password-reset-resetCode',
        'locale-password-reset-resetCode',
        'questions',
        'locale-questions',
      ],
      errorPageContent: undefined,
    }),

  getters: {
    currentLocale(state):LocaleInterface|undefined {
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
      const zonesArr = state.settingsConstants?.player.timeZone.map((zone) => ({
        ...zone,
        code: zone.id,
        value: zone.name,
      }));
      return zonesArr || [];
    },
    headerContent(state): HeaderInterface|undefined {
      return state.layoutData?.header;
    },
    sidebarContent(state):SiteSidebarInterface|undefined {
      return state.layoutData?.siteSidebar;
    },
    userNavigationContent(state):UserNavigationInterface|undefined {
      return state.layoutData?.userNavigation;
    },
    footerContent(state):FooterInterface|undefined {
      return state.layoutData?.footer;
    },
    cookiePopupContent(state):CookiePopupInterface|undefined {
      return state.layoutData?.cookiePopup;
    },
    mobileMenuContent(state):MobileMenuInterface|undefined {
      return state.layoutData?.mobileMenu;
    },
    gameCategoriesObj(state):{ [key: string]: GameCategoryInterface } {
      const categoriesObj:any = {};
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
    playerStatuses(state):StatusInterface[] {
      return state.settingsConstants?.player.playerStatuses || [];
    },
    invoiceStatuses(state):StatusInterface[] {
      return state.settingsConstants?.payment.invoiceStatuses || [];
    },
    invoiceTypes(state):StatusInterface[] {
      return state.settingsConstants?.payment.invoiceTypes || [];
    },
    betStatuses(state):StatusInterface[] {
      return state.settingsConstants?.game.bet.status || [];
    },
    documentStatuses(state):StatusInterface[] {
      return state.settingsConstants?.player.document.status || [];
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

    async getSettingsConstants():Promise<void> {
      const { getCoreConstants } = useCoreGlobalApi();
      const data = await getCoreConstants();
      this.settingsConstants = data;
    },

    async getGlobalContent():Promise<void> {
      const [validationsResponse, fieldsDataResponse, layoutDataResponse, popupsDataResponse, alertsDataResponse, globalContentResponse, errorPageResponse] = await Promise.allSettled([
        queryContent(`validations/${this.currentLocale?.code}`).findOne(),
        queryContent(`fields/${this.currentLocale?.code}`).findOne(),
        queryContent(`main-layout/${this.currentLocale?.code}`).findOne(),
        queryContent(`popups/${this.currentLocale?.code}`).findOne(),
        queryContent(`alerts/${this.currentLocale?.code}`).findOne(),
        queryContent(`global-components/${this.currentLocale?.code}`).findOne(),
        queryContent(`page-controls/${this.currentLocale?.code}`).only(['errorPage']).findOne(),
      ]);
      if (validationsResponse.status !== 'rejected') this.validationMessages = validationsResponse.value;
      if (fieldsDataResponse.status !== 'rejected') this.fieldsContent = (fieldsDataResponse.value as unknown) as FieldsContentInterface;
      if (layoutDataResponse.status !== 'rejected') this.layoutData = (layoutDataResponse.value as unknown) as MainLayoutInterface;
      if (popupsDataResponse.status !== 'rejected') this.popupsData = (popupsDataResponse.value as unknown) as PopupsInterface;
      if (alertsDataResponse.status !== 'rejected') this.alertsData = (alertsDataResponse.value as unknown) as AlertsListInterface;
      if (globalContentResponse.status !== 'rejected') this.globalComponentsContent = (globalContentResponse.value as unknown) as GlobalComponentsInterface;
      if (errorPageResponse.status !== 'rejected') this.errorPageContent = (errorPageResponse.value.errorPage as unknown) as ErrorPageInterface;
    },

    getRequestCountry():void {
      const { countryHeaderName } = useCoreStore();
      const headersCountry:Record<string, any> = useRequestHeaders([countryHeaderName]);
      if (headersCountry[countryHeaderName]) this.headerCountry = headersCountry[countryHeaderName]?.toUpperCase();
    },
  },
});

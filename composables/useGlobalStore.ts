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
  settingsConstants: Maybe<CoreConstantsInterface>,
  defaultLocale: Maybe<LocaleInterface>,
  isMobile: boolean,
  browserLanguage: string,
  baseApiUrl: string,
  validationMessages: ValidationMessageInterface|{},
  defaultLocaleValidationMessages: ValidationMessageInterface|{},
  fieldsContent: Maybe<FieldsContentInterface>,
  defaultLocaleFieldsContent: Maybe<FieldsContentInterface>,
  layoutData: Maybe<MainLayoutInterface>,
  defaultLocaleLayoutData: Maybe<MainLayoutInterface>,
  popupsData: Maybe<PopupsInterface>,
  defaultLocalePopupsData: Maybe<PopupsInterface>,
  alertsData: Maybe<AlertsListInterface>,
  defaultLocaleAlertsData: Maybe<AlertsListInterface>,
  globalComponentsContent: Maybe<GlobalComponentsInterface>,
  defaultLocaleGlobalComponentsContent: Maybe<GlobalComponentsInterface>,
  headerCountry: Maybe<string>,
  pagesWithoutLocale: string[],
  errorPageContent: Maybe<ErrorPageInterface>,
  defaultLocaleErrorPageContent: Maybe<ErrorPageInterface>,
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
      defaultLocaleValidationMessages: {},
      fieldsContent: undefined,
      defaultLocaleFieldsContent: undefined,
      layoutData: undefined,
      defaultLocaleLayoutData: undefined,
      popupsData: undefined,
      defaultLocalePopupsData: undefined,
      alertsData: undefined,
      defaultLocaleAlertsData: undefined,
      globalComponentsContent: undefined,
      defaultLocaleGlobalComponentsContent: undefined,
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
      defaultLocaleErrorPageContent: undefined,
    }),

  getters: {
    currentLocale(state): Maybe<LocaleInterface> {
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
    headerContent(state): Maybe<HeaderInterface> {
      return state.layoutData?.header;
    },
    defaultLocaleHeaderContent(state): Maybe<HeaderInterface> {
      return state.defaultLocaleLayoutData?.header;
    },
    sidebarContent(state): Maybe<SiteSidebarInterface> {
      return state.layoutData?.siteSidebar;
    },
    defaultLocaleSidebarContent(state): Maybe<SiteSidebarInterface> {
      return state.defaultLocaleLayoutData?.siteSidebar;
    },
    userNavigationContent(state): Maybe<UserNavigationInterface> {
      return state.layoutData?.userNavigation;
    },
    defaultLocaleUserNavigationContent(state): Maybe<UserNavigationInterface> {
      return state.defaultLocaleLayoutData?.userNavigation;
    },
    footerContent(state): Maybe<FooterInterface> {
      return state.layoutData?.footer;
    },
    defaultLocaleFooterContent(state): Maybe<FooterInterface> {
      return state.defaultLocaleLayoutData?.footer;
    },
    cookiePopupContent(state): Maybe<CookiePopupInterface> {
      return state.layoutData?.cookiePopup;
    },
    defaultLocaleCookiePopupContent(state): Maybe<CookiePopupInterface> {
      return state.defaultLocaleLayoutData?.cookiePopup;
    },
    mobileMenuContent(state): Maybe<MobileMenuInterface> {
      return state.layoutData?.mobileMenu;
    },
    defaultLocaleMobileMenuContent(state): Maybe<MobileMenuInterface> {
      return state.defaultLocaleLayoutData?.mobileMenu;
    },
    gameCategoriesObj(state):{ [key: string]: GameCategoryInterface } {
      const categoriesObj:any = {};

      const categoriesContent = state.globalComponentsContent?.categories
          || state.defaultLocaleGlobalComponentsContent?.categories;

      if (categoriesContent) {
        categoriesContent.forEach((category) => {
          categoriesObj[category.identity] = category;
        });
      }
      return categoriesObj;
    },
    globalSeo(state): Maybe<SeoContentInterface> {
      return state.globalComponentsContent?.globalSeo || state.defaultLocaleGlobalComponentsContent?.globalSeo;
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
      const { getContentLocalesArray, findLocalesContentData } = useProjectMethods();

      const localesArr = getContentLocalesArray();

      const [
        validationsResponse,
        fieldsDataResponse,
        layoutDataResponse,
        popupsDataResponse,
        alertsDataResponse,
        globalContentResponse,
        errorPageResponse,
      ] = await Promise.allSettled([
        queryContent('validations').where({ locale: { $in: localesArr } }).find(),
        queryContent('fields').where({ locale: { $in: localesArr } }).find(),
        queryContent('main-layout').where({ locale: { $in: localesArr } }).find(),
        queryContent('popups').where({ locale: { $in: localesArr } }).find(),
        queryContent('alerts').where({ locale: { $in: localesArr } }).find(),
        queryContent('global-components').where({ locale: { $in: localesArr } }).find(),
        queryContent('page-controls').where({ locale: { $in: localesArr } }).only(['errorPage', 'locale']).find(),
      ]);

      if (validationsResponse.status !== 'rejected') {
        const { currentLocaleData, defaultLocaleData } = findLocalesContentData(validationsResponse.value);
        this.validationMessages = currentLocaleData as ValidationMessageInterface;
        this.defaultLocaleValidationMessages = defaultLocaleData as ValidationMessageInterface;
      }

      if (fieldsDataResponse.status !== 'rejected') {
        const { currentLocaleData, defaultLocaleData } = findLocalesContentData(fieldsDataResponse.value);
        this.fieldsContent = currentLocaleData as FieldsContentInterface;
        this.defaultLocaleFieldsContent = defaultLocaleData as FieldsContentInterface;
      }

      if (layoutDataResponse.status !== 'rejected') {
        const { currentLocaleData, defaultLocaleData } = findLocalesContentData(layoutDataResponse.value);
        this.layoutData = currentLocaleData as MainLayoutInterface;
        this.defaultLocaleLayoutData = defaultLocaleData as MainLayoutInterface;
      }

      if (popupsDataResponse.status !== 'rejected') {
        const { currentLocaleData, defaultLocaleData } = findLocalesContentData(popupsDataResponse.value);
        this.popupsData = currentLocaleData as PopupsInterface;
        this.defaultLocalePopupsData = defaultLocaleData as PopupsInterface;
      }

      if (alertsDataResponse.status !== 'rejected') {
        const { currentLocaleData, defaultLocaleData } = findLocalesContentData(alertsDataResponse.value);
        this.alertsData = currentLocaleData as AlertsListInterface;
        this.defaultLocaleAlertsData = defaultLocaleData as AlertsListInterface;
      }

      if (globalContentResponse.status !== 'rejected') {
        const { currentLocaleData, defaultLocaleData } = findLocalesContentData(globalContentResponse.value);
        this.globalComponentsContent = currentLocaleData as GlobalComponentsInterface;
        this.defaultLocaleGlobalComponentsContent = defaultLocaleData as GlobalComponentsInterface;
      }

      if (errorPageResponse.status !== 'rejected') {
        const { currentLocaleData, defaultLocaleData } = findLocalesContentData(errorPageResponse.value);
        this.errorPageContent = currentLocaleData.errorPage as ErrorPageInterface;
        this.defaultLocaleErrorPageContent = defaultLocaleData as ErrorPageInterface;
      }
    },

    getRequestCountry():void {
      const { countryHeaderName } = useCoreStore();
      const headersCountry:Record<string, any> = useRequestHeaders([countryHeaderName]);
      if (headersCountry[countryHeaderName]) this.headerCountry = headersCountry[countryHeaderName]?.toUpperCase();
    },
  },
});

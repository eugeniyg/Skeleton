// eslint-disable-next-line consistent-return
export default defineNuxtPlugin(async ():Promise<any> => {
  const {
    getCurrencies,
    getLocales,
    getCountries,
    getGlobalContent,
    getRequestCountry,
    getSettingsConstants,
    pagesWithoutLocale,
  } = useGlobalStore();
  const { getGameProviders, getGameCollections } = useGamesStore();

  getRequestCountry();

  await Promise.all([
    getLocales(),
    getCountries(),
  ]);

  const checkLanguage = ():string|undefined => {
    const cookieLanguage = useCookie('user-language');
    const globalStore = useGlobalStore();
    const defaultLocale = globalStore.locales.find(locale => locale.isDefault);
    const route = useRoute();
    const routeLocale = route.params.locale as string;

    if (!cookieLanguage.value) {
      const geoCountry = globalStore.countries.find(country => country.code.toUpperCase() === globalStore.headerCountry?.toUpperCase());
      if (geoCountry) cookieLanguage.value = geoCountry.locale;
      else cookieLanguage.value = routeLocale || defaultLocale?.code;
    }

    let needChangeLanguage = false;
    if (route.name && routeLocale) {
      needChangeLanguage = routeLocale !== cookieLanguage.value;
    } else if (route.name && !routeLocale) {
      needChangeLanguage = defaultLocale?.code !== cookieLanguage.value;
    }

    if (needChangeLanguage && !pagesWithoutLocale.includes(route.name as string)) {
      const fullPathWithoutLocale = routeLocale ? route.fullPath.substring(routeLocale.length + 1) : route.fullPath;
      const routePath = `${fullPathWithoutLocale === '/' ? '' : fullPathWithoutLocale}`;
      if (cookieLanguage.value === defaultLocale?.code) return routePath;
      return `/${cookieLanguage.value}${routePath}`;
    } return undefined;
  };

  const redirectUrl = checkLanguage();
  if (redirectUrl !== undefined) {
    navigateTo(redirectUrl);
  }

  if (process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  const { getSessionToken } = useProfileStore();
  const sessionToken = getSessionToken();

  const { getProfileData } = useProfileStore();
  const { getUserAccounts } = useWalletStore();

  const globalRequests = Promise.all([
    getCurrencies(),
    getSettingsConstants(),
    getGameProviders(),
    getGameCollections(),
    getGlobalContent()
  ]);

  if (sessionToken) {
    const profileRequests = Promise.all([
      getProfileData(),
      getUserAccounts(),
    ]);

    await Promise.allSettled([
      globalRequests,
      profileRequests,
    ]);
  } else {
    await globalRequests;
  }
});

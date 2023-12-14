// eslint-disable-next-line consistent-return
export default defineNuxtPlugin(async ():Promise<any> => {
  const {
    getCurrencies,
    getLocales,
    getCountries,
    getGlobalContent,
    getRequestCountry,
    getSettingsConstants
  } = useGlobalStore();
  const { getGameProviders, getGameCollections } = useGamesStore();

  getRequestCountry();

  if (process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  const { getSessionToken } = useProfileStore();
  const sessionToken = getSessionToken();

  const { getProfileData } = useProfileStore();
  const { getUserAccounts } = useWalletStore();

  const globalRequests = Promise.all([
    getLocales(),
    getCountries(),
    getCurrencies(),
    getSettingsConstants(),
    getGameProviders(),
    getGameCollections()
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

  const cookieLanguage = useCookie('user-language');
  const globalStore = useGlobalStore();

  console.log('cookieLanguage.value: ', cookieLanguage.value)
  if (cookieLanguage.value) {
    const cookieLanguageData = globalStore.locales.find(locale => locale.code === cookieLanguage.value);
    console.log('cookieLanguageData: ', cookieLanguageData);
    globalStore.currentLocale = cookieLanguageData ?? globalStore.defaultLocale;
  } else {
    const geoCountry = globalStore.countries.find(country => country.code.toUpperCase() === globalStore.headerCountry?.toUpperCase());
    console.log('geoCountry: ', geoCountry);
    const geoLocaleData = globalStore.locales.find(locale => locale.code === geoCountry?.locale);
    console.log('geoLocaleData: ', geoLocaleData);
    globalStore.currentLocale = geoLocaleData ?? globalStore.defaultLocale;
  }
  console.log('globalStore.currentLocale: ', globalStore.currentLocale);

  await getGlobalContent();
});

// eslint-disable-next-line consistent-return
export default defineNuxtPlugin(async ():Promise<any> => {
  const {
    getCurrencies,
    getLocales,
    getCountries,
    getGlobalContent,
    getRequestCountry,
    getSettingsConstants,
    setCurrentLocale
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

  // const cookieLanguage = useCookie('user-language');
  // const globalStore = useGlobalStore();
  //
  // if (cookieLanguage.value) {
  //   const cookieLanguageData = globalStore.locales.find(locale => locale.code === cookieLanguage.value);
  //   globalStore.currentLocale = cookieLanguageData ?? globalStore.defaultLocale;
  // } else {
  //   const geoCountry = globalStore.countries.find(country => country.code.toUpperCase() === globalStore.headerCountry?.toUpperCase());
  //   const geoLocaleData = globalStore.locales.find(locale => locale.code === geoCountry?.locale);
  //   globalStore.currentLocale = geoLocaleData ?? globalStore.defaultLocale;
  // }
  // console.log('server-current-locale: ', globalStore.currentLocale?.code || 'empty');

  setCurrentLocale();
  await getGlobalContent();
});

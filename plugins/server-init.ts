export default defineNuxtPlugin(async (nuxtApp) => {
  const {
    getCurrencies,
    getLocales,
    getCountries,
    getGlobalContent,
    getRequestCountry,
    pagesWithoutLocale,
  } = useGlobalStore();
  const { getRegistrationFields } = useFieldsStore();
  const { getGameProviders, getGameCollections } = useGamesStore();

  if (process.server && process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  const checkLanguage = ():void => {
    const cookieLanguage = useCookie('user-language');
    const route = useRoute();
    const needChangeLanguage = route.name && !route.params.locale && !!cookieLanguage.value;

    if (needChangeLanguage && !pagesWithoutLocale.includes(route.name as string)) {
      navigateTo(`/${cookieLanguage.value}${route.fullPath === '/' ? '' : route.fullPath}`, { replace: true });
    }
  };

  if (process.server) {
    getRequestCountry();

    try {
      await Promise.all([
        getCurrencies(),
        getLocales(),
        getCountries(),
        getRegistrationFields(),
        getGameProviders(),
        getGameCollections(),
      ]);

      checkLanguage();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await getGlobalContent();
    }
  }
});

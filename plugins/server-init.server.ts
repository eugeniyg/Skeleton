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

  const checkLanguage = ():string|undefined => {
    const cookieLanguage = useCookie('user-language');
    const route = useRoute();
    const needChangeLanguage = route.name && !route.params.locale && !!cookieLanguage.value;

    if (needChangeLanguage && !pagesWithoutLocale.includes(route.name as string)) {
      return `/${cookieLanguage.value}${route.fullPath === '/' ? '' : route.fullPath}`;
    } return undefined;
  };

  const redirectUrl = checkLanguage();
  if (redirectUrl !== undefined) {
    return navigateTo(redirectUrl, { replace: true });
  }

  if (process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  getRequestCountry();

  const { getSessionToken } = useCoreAuthStore();
  const sessionToken = getSessionToken();

  const { getProfileData, logOutUser } = useProfileStore();
  const { getUserAccounts } = useWalletStore();

  const settingsRequest = Promise.all([
    getCurrencies(),
    getLocales(),
    getCountries(),
    getSettingsConstants(),
    getGameProviders(),
    getGameCollections(),
  ]);

  if (sessionToken) {
    const profileRequests = Promise.all([
      getProfileData(),
      getUserAccounts(),
    ]);

    await Promise.allSettled([
      settingsRequest,
      profileRequests,
    ]);
  } else {
    await settingsRequest;
  }
  await getGlobalContent();
});

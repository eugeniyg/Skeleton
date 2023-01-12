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

  const token = useCookie('bearer');

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

  if (token.value) {
    const profileRequests = Promise.all([
      getProfileData(),
      getUserAccounts(),
    ]);

    const requestResult = await Promise.allSettled([
      settingsRequest,
      profileRequests,
    ]);

    if (requestResult[1].status === 'rejected'
        && requestResult[1].reason.response.status === 401) logOutUser(false);
  } else {
    await settingsRequest;
  }
  await getGlobalContent();
});

import { useWalletStore } from '~/composables/useWalletStore';
import { useGamesStore } from '~/composables/useGamesStore';

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

    const token = useCookie('bearer');

    const { getProfileData, logOutUser } = useProfileStore();
    const { getUserAccounts } = useWalletStore();
    const { getFavoriteGames } = useGamesStore();

    const settingsRequest = Promise.all([
      getCurrencies(),
      getLocales(),
      getCountries(),
      getRegistrationFields(),
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

      if (requestResult[1].status === 'fulfilled') {
        await getFavoriteGames();
      } else if (requestResult[1].reason.response.status === 401) logOutUser(false);
    } else {
      await settingsRequest;
    }
    checkLanguage();
    await getGlobalContent();
  }
});

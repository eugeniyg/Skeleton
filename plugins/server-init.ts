import { useWalletStore } from '~/composables/useWalletStore';
import { useGamesStore } from '~/composables/useGamesStore';

export default defineNuxtPlugin(async (nuxtApp) => {
  const {
    getCurrencies,
    getLocales,
    getCountries,
    getGlobalContent,
    getRequestCountry,
  } = useGlobalStore();
  const { getRegistrationFields } = useFieldsStore();
  const { getGameProviders, getGameCollections } = useGamesStore();

  if (process.server && process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  if (process.server) {
    getRequestCountry();
    const headerCookie = useRequestHeaders(['cookie']);
    let token;
    if (headerCookie.cookie) {
      const splitCookies = headerCookie.cookie.split('; ');
      const splitKeyValue = splitCookies.map((cookie) => cookie.split('='));
      const cookieObj = Object.fromEntries(splitKeyValue);
      token = cookieObj.bearer;
    }

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

    if (token) {
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
    await getGlobalContent();
  }
});

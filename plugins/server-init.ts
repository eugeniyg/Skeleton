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
    const headerCookie = useRequestHeaders(['cookie']);
    let token;
    if (headerCookie.cookie) {
      const splitCookies = headerCookie.cookie.split('; ');
      const splitKeyValue = splitCookies.map((cookie) => cookie.split('='));
      const cookieObj = Object.fromEntries(splitKeyValue);
      token = cookieObj.bearer;
    }

    const profileStore = useProfileStore();
    const { getUserAccounts } = useWalletStore();
    const { getFavoriteGames } = useGamesStore();
    if (token) {
      try {
        await Promise.all([
          profileStore.getProfileData(),
          getUserAccounts(),
        ]);
        getFavoriteGames();
      } catch (error) {
        if (error.response?.status === 401) {
          profileStore.logOutUser(false);
        } else {
          throw error;
        }
      }
    }

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
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await getGlobalContent();
    }
  }
});

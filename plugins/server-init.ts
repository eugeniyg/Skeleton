// import parser from 'accept-language-parser';
// import { useAuthApi } from '~/CORE';

const useAppCookie = () => useCookie('bearer');

export default defineNuxtPlugin(async (nuxtApp) => {
  const {
    getCurrencies,
    getLocales,
    getCountries,
  } = useGlobalStore();
  const { getRegistrationFields } = useFieldsStore();
  const { getGameProviders, getGameCollections } = useGamesStore();

  if (process.server && process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  if (process.server) {
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
    }
  }

  if (process.client) {
    const { parseUserAgent } = useGlobalStore();
    // const languages = parser.parse(nuxtApp.ssrContext.req.headers['accept-language']);
    // setBrowserLanguage(languages);
    const { userAgent } = window.navigator;
    parseUserAgent(userAgent);

    const { getProfileData } = useProfileStore();
    const { getUserAccounts } = useWalletStore();
    const { getFavoriteGames } = useGamesStore();
    const bearer = useAppCookie();
    if (bearer.value) {
      try {
        await Promise.all([
          getProfileData(),
          getUserAccounts(),
        ]);
        getFavoriteGames();
      } catch (error) {
        if (error.response?.status === 401) {
          const { logOutUser } = useProfileStore();
          logOutUser();
        } else {
          throw error;
        }
      }
    }
  }
});

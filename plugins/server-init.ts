export default defineNuxtPlugin(async (nuxtApp) => {
  const {
    getCurrencies,
    getLocales,
    getCountries,
    getGlobalContent,
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
    } finally {
      await getGlobalContent();
    }
  }
});

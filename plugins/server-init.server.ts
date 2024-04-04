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
  const { getGameCollections } = useGamesStore();

  getRequestCountry();

  if (process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  await Promise.all([
    getLocales(),
    getCountries(),
    getCurrencies(),
    getSettingsConstants(),
    getGameCollections()
  ]);

  setCurrentLocale();
  await getGlobalContent();
});

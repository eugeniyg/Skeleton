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

  getRequestCountry();

  if (process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  await Promise.all([
    getLocales(),
    getCountries(),
    getCurrencies(),
    getSettingsConstants()
  ]);

  setCurrentLocale();
  //await getGlobalContent();
});

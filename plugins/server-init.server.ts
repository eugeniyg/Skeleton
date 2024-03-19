export default defineNuxtPlugin(async ():Promise<any> => {
  const globalStore = useGlobalStore();

  const { getGameProviders, getGameCollections } = useGamesStore();

  globalStore.getRequestCountry();

  if (process.env.NODE_ENV === 'development') {
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  if(!process.server) {
    await Promise.all([
      globalStore.getLocales(),
      globalStore.getCountries(),
      globalStore.getCurrencies(),
      globalStore.getSettingsConstants(),
    ]);
  }

  await Promise.all([
    getGameProviders(),
    getGameCollections()
  ]);

  globalStore.setCurrentLocale();
  await globalStore.getGlobalContent();
});

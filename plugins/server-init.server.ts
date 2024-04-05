export default defineNuxtPlugin(async ():Promise<any> => {
  const globalStore = useGlobalStore();

  if (process.env.NODE_ENV === 'development') {
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  const requestEvent = useRequestEvent();
  const { currencies, locales, countries, constants } = requestEvent.initData;

  globalStore.setCurrencies(currencies);
  globalStore.setLocales(locales);
  globalStore.setCountries(countries);
  globalStore.setSettingsConstants(constants);
  globalStore.getRequestCountry();
  globalStore.setCurrentLocale();

  await globalStore.getGlobalContent();
});

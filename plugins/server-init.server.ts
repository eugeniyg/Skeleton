export default defineNuxtPlugin(async (): Promise<any> => {
  const {
    getCurrencies,
    getLocales,
    getCountries,
    getGlobalContent,
    getRequestCountry,
    getSettingsConstants,
    setCurrentLocale,
  } = useGlobalStore();

  getRequestCountry();

  await Promise.all([getLocales(), getCountries(), getCurrencies(), getSettingsConstants()]);

  setCurrentLocale();
  await getGlobalContent();
});

export default defineNitroPlugin( (nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const [currencies, locales, countries, constants] = await Promise.all([
      getCurrencies(),
      getLocales(),
      getCountries(),
      getConstants()
    ]);

    event.initData = { currencies, locales, countries, constants };
  })
})
import { getServerCache, setServerCache } from '@skeleton/server/utils/useServerCache';

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

  const dataKeys = [
    'cache:locales',
    'cache:countries',
    'cache:currencies',
    'cache:settings-constants',
    'cache:collections',
    'cache:providers',
  ];

  const [
    cachedLocales,
    cachedCountries,
    cachedCurrencies,
    cachedSettingsConstants,
    cachedCollections,
    cachedProviders,
  ] = await Promise.all(
    dataKeys.map(async key => {
      try {
        const { data } = await getServerCache(key);
        return data;
      } catch {
        return undefined;
      }
    })
  );

  const { getCollections, getProviders } = useGamesStore();
  const [locales, countries, currencies, settingsConstants, collections, providers] = await Promise.all([
    getLocales(cachedLocales),
    getCountries(cachedCountries),
    getCurrencies(cachedCurrencies),
    getSettingsConstants(cachedSettingsConstants),
    getCollections(cachedCollections),
    getProviders(cachedProviders),
  ]);

  const toCache = [
    { key: 'cache:locales', data: locales, cached: !!cachedLocales, ttl: 600 },
    { key: 'cache:countries', data: countries, cached: !!cachedCountries, ttl: 600 },
    { key: 'cache:currencies', data: currencies, cached: !!cachedCurrencies, ttl: 600 },
    { key: 'cache:settings-constants', data: settingsConstants, cached: !!cachedSettingsConstants, ttl: 600 },
    { key: 'cache:collections', data: collections, cached: !!cachedCollections, ttl: 120 },
    { key: 'cache:providers', data: providers, cached: !!cachedProviders, ttl: 120 },
  ];

  toCache.forEach(item => {
    const { key, data, cached, ttl } = item;
    if (data && !cached) {
      setServerCache({ key, data, ttl });
    }
  });

  setCurrentLocale();
  await getGlobalContent();
});

// eslint-disable-next-line consistent-return
export default defineNuxtPlugin(async (ctx):Promise<any> => {
  const { payload } = ctx;

  if(payload.serverRendered && payload.path.startsWith('/_content')) {
    console.log('YEAH, lets do some shit on content request');
    return;
  }

  const {
    getCurrencies,
    getLocales,
    getCountries,
    getGlobalContent,
    getRequestCountry,
    getSettingsConstants,
    setCurrentLocale
  } = useGlobalStore();
  const { getGameProviders, getGameCollections } = useGamesStore();

  getRequestCountry();

  if (process.env.NODE_ENV === 'development') {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  const { getSessionToken } = useProfileStore();
  const sessionToken = getSessionToken();

  const { getProfileData } = useProfileStore();
  const { getUserAccounts } = useWalletStore();

  const globalRequests = Promise.all([
    getLocales(),
    getCountries(),
    getCurrencies(),
    getSettingsConstants(),
    getGameProviders(),
    getGameCollections()
  ]);

  if (sessionToken) {
    const profileRequests = Promise.all([
      getProfileData(),
      getUserAccounts(),
    ]);

    await Promise.allSettled([
      globalRequests,
      profileRequests,
    ]);
  } else {
    await globalRequests;
  }

  setCurrentLocale();
  await getGlobalContent();
});

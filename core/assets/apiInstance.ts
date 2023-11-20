import queryString from 'query-string';

export const useFetchInstance = async (url:string, options?:any):Promise<any> => {
  const profileStore = useProfileStore();
  const globalStore = useGlobalStore();
  const { isTokenExpired } = profileStore;
  const cookieToken = useCookie('access_token', { maxAge: 60 * 60 * 24 * 30 });
  const storeToken = profileStore.currentSessionToken;
  const token = storeToken || cookieToken.value;
  let serverRequestHeaders = {};

  if (process.server) {
    const requestHeaders = useRequestHeaders();

    serverRequestHeaders = {
      'User-Agent': requestHeaders['user-agent'],
      'Accept-Language': requestHeaders['accept-language'],
      'Accept-Encoding': requestHeaders['accept-encoding'],
      [globalStore.countryHeaderName]: requestHeaders[globalStore.countryHeaderName],
      Referer: requestHeaders.referer
    };
  }

  const baseURL = process.server && process.env.API_BASE_URL ? process.env.API_BASE_URL : '';
  let newUrl = url;

  if (options?.params) {
    const stringifyParams = queryString.stringify(options.params, { arrayFormat: 'bracket' });
    newUrl = `${url}?${stringifyParams}`;
  }

  const newOptions = {
    ...options,
    baseURL,
    params: undefined,
    headers: {
      ...serverRequestHeaders,
      ...options?.headers
    },
    credentials: 'omit',
    retry: 0
  };

  if (token) { newOptions.headers.Authorization = `Bearer ${token}` };

  if (token && isTokenExpired()) {
    const { refreshToken } = useCoreAuthApi();
    try {
      const { data } = await refreshToken(newOptions);
      profileStore.currentSessionToken = data.accessToken;
      cookieToken.value = data.accessToken;
      newOptions.headers.Authorization = `Bearer ${data.accessToken}`;
    } catch {
      profileStore.currentSessionToken = null;
      cookieToken.value = null;
      newOptions.headers.Authorization = undefined;
    }
  }

  return await $fetch(newUrl, newOptions);
}

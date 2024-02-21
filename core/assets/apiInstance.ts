import queryString from 'query-string';

export const useFetchInstance = async (url:string, options?:any):Promise<any> => {
  const profileStore = useProfileStore();
  const globalStore = useGlobalStore();

  let token = profileStore.getSessionToken();
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

  if (token && profileStore.isTokenExpired()) {
    try {
      token = await profileStore.refreshToken(newOptions);
      newOptions.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      profileStore.removeSession();
      newOptions.headers.Authorization = undefined;
    }
  }

  return await $fetch(newUrl, newOptions);
}

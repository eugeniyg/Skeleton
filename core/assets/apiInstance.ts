import queryString from 'query-string';

export const useFetchInstance = async (url:string, options?:any):Promise<any> => {
  const profileStore = useProfileStore();
  let token = profileStore.getSessionToken();

  let newUrl = url;

  if (options?.params) {
    const stringifyParams = queryString.stringify(options.params, { arrayFormat: 'bracket' });
    newUrl = `${url}?${stringifyParams}`;
  }

  const newOptions = {
    ...options,
    params: undefined,
    headers: { ...options?.headers },
    credentials: 'omit',
    retry: 0
  };

  if (token) { newOptions.headers.Authorization = `Bearer ${token}` };

  if (token && profileStore.isTokenExpired()) {
    try {
      token = await profileStore.refreshToken();
      newOptions.headers.Authorization = `Bearer ${token}`;
    } catch {
      profileStore.removeSession();
      newOptions.headers.Authorization = undefined;
    }
  }

  return await $fetch(newUrl, newOptions);
}

import queryString from 'query-string';

export const useApiAuthInstance = async (url:string, options?:any):Promise<any> => {
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
    retry: 0,
    async onResponseError({ response }: any) {
      if (response.status === 401 || response.status === 403) {
        if (profileStore.getSessionToken()) profileStore.removeSession();
        const { localizePath } = useProjectMethods();
        const router = useRouter();
        const nuxtApp = useNuxtApp();
        if (import.meta.client && nuxtApp.isHydrating) {
          await router.push(localizePath('/?sign-in=true'));
        } else {
          const { openModal } = useModalStore();
          await openModal('sign-in', undefined, false);
          await router.push(localizePath('/?sign-in=true'));
        }
      }
    },
  };

  if (import.meta.server) {
    console.log('API INSTANCE TOKEN: ', token);
    console.log('API INSTANCE OPTIONS: ', newOptions);
    console.log('API INSTANCE REQUEST URL: ', newUrl);
  }

  if (token) { newOptions.headers.Authorization = `Bearer ${token}` }

  if (token && profileStore.isTokenExpired()) {
    token = await profileStore.refreshToken();
    if (token) {
      newOptions.headers.Authorization = `Bearer ${token}`;
    } else {
      delete newOptions.headers.Authorization;
    }
  }

  return await $fetch(newUrl, newOptions);
}

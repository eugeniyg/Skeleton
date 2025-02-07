import queryString from 'query-string';

export const useApiAuthInstance = async (url: string, options?: any): Promise<any> => {
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
      console.log(`-- Request Error: ${response.status} --`);
      if (response.status === 401 || response.status === 403) {
        if (profileStore.getSessionToken()) {
          console.log('-- Remove Session After Request Error 401/403 --');
          await profileStore.removeSession();
        }
        const { localizePath } = useProjectMethods();
        const router = useRouter();
        const nuxtApp = useNuxtApp();
        if (import.meta.client && nuxtApp.isHydrating) {
          await router.push(localizePath('/?sign-in=true'));
        } else {
          const { openModal } = useModalStore();
          await openModal('sign-in', { prohibitQueryChange: false });
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

  if (token) {
    newOptions.headers.Authorization = `Bearer ${token}`;
  }

  if (token && profileStore.isTokenExpired()) {
    token = await profileStore.refreshToken();
    if (token) {
      newOptions.headers.Authorization = `Bearer ${token}`;
    } else {
      delete newOptions.headers.Authorization;
    }
  }

  return await $fetch(newUrl, newOptions);
};

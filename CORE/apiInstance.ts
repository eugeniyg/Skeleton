import { useAuthApi } from './useAuthApi';
import { useCoreStore } from './useCoreStore';

const appCookie = () => useCookie('bearer');

export const useFetchInstance = async (url:string, options?:any):Promise<any> => {
  const baseURL = process.server && process.env.API_BASE_URL ? process.env.API_BASE_URL : '';
  const newOptions = {
    ...options,
    baseURL,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
    },
  };

  if (process.client) {
    const token = appCookie();
    if (token.value) {
      newOptions.headers.Authorization = `Bearer ${token.value}`;
    }
  }

  const fetchResponse = await $fetch(url, newOptions).catch(async (err) => {
    if (err.response.status === 401) {
      const { refreshToken } = useAuthApi();
      const coreStore = useCoreStore();
      try {
        const { data } = await refreshToken();
        coreStore.refreshPromise = undefined;
        const token = appCookie();
        token.value = data.accessToken;
        newOptions.headers.Authorization = `Bearer ${token.value}`;
        return $fetch(url, newOptions);
      } catch {
        throw err;
      }
    } throw err;
  });

 return fetchResponse;
};

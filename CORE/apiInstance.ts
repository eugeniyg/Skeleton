const appCookie = () => useCookie('bearer');

export const useFetchInstance = (url:string, options?:any):any => {
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

 return $fetch(url, newOptions);
};

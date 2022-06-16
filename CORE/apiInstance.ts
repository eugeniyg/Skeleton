const appCookie = () => useCookie('bearer');

export const useFetchInstance = (url:string, options?:any):any => {
  const baseURL = process.server && process.env.API_BASE_URL ? process.env.API_BASE_URL : '';
  const newOptions = { ...options, baseURL };

  const token = appCookie();
  if (token.value) {
    newOptions.headers = {
      ...options?.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    };
  }

  console.log(url);
  return $fetch(url, newOptions);
};

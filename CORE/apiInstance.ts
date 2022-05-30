export const useFetchInstance = (url:string, options?:any):Promise<any> => {
  const baseURL = process.server && process.env.API_BASE_URL ? process.env.API_BASE_URL : '';
  const newOptions = { ...options, baseURL, 'Content-Type': '' };

  const token = useCookie('bearer');
  if (token.value) {
    newOptions.headers = {
      ...options?.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    };
  }
  return $fetch(url, newOptions);
};

import queryString from 'query-string';

export const useApiGuestInstance = async (url:string, options?:any):Promise<any> => {
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
    credentials: 'omit',
    retry: 0
  };

  return await $fetch(newUrl, newOptions);
}

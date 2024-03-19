import queryString from 'query-string';

export const useBaseFetchInstance = async (url:string, options?:any):Promise<any> => {
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
    retry: 0
  };

  console.log(newUrl);

  return await $fetch(newUrl, newOptions);
}

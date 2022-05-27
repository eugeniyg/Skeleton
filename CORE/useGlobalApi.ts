import { useFetchInstance } from './apiInstance';

const useGlobalApi = () => {
  const getCurrencies = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/settings/currencies');
    return data;
  };

  const getLocales = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/settings/locales');
    return data;
  };

  const getCountries = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/settings/countries');
    return data;
  };

  const getCommonData = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/player/commons/constants');
    return data;
  };

  return {
    getCurrencies,
    getLocales,
    getCountries,
    getCommonData,
  };
};

export { useGlobalApi };

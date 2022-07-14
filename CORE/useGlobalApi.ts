import { useFetchInstance } from './apiInstance';
import {
 CommonDataInterface, CountryInterface, CurrencyInterface, LocaleInterface,
} from './types';

const useGlobalApi = () => {
  const getCurrencies = async ():Promise<CurrencyInterface[]> => {
    const { data } = await useFetchInstance('/api/settings/currencies');
    return data;
  };

  const getLocales = async ():Promise<LocaleInterface[]> => {
    const { data } = await useFetchInstance('/api/settings/locales');
    return data;
  };

  const getCountries = async ():Promise<CountryInterface[]> => {
    const { data } = await useFetchInstance('/api/settings/countries');
    return data;
  };

  const getCommonData = async ():Promise<CommonDataInterface> => {
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

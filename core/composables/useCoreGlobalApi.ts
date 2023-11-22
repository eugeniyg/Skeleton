import type {
  IContactMessageRequest,
  ICoreConstants,
  ICountry,
  ICurrency,
  IInitUserInfo,
  ILocale
} from '../types';
import { useFetchInstance } from '../assets/apiInstance';
// import { getCacheData, setCacheData } from '../assets/coreCache';

export const useCoreGlobalApi = () => {
  const getCurrencies = async (visible?: number):Promise<ICurrency[]> => {
    // const cacheCurrencies = getCacheData('currencies');
    // if (cacheCurrencies) {
    //   return cacheCurrencies;
    // }

    const { data } = await useFetchInstance('/api/settings/currencies', { params: { visible } });
    // setCacheData('currencies', data);
    return data;
  };

  const getLocales = async ():Promise<ILocale[]> => {
    // const cacheLocales = getCacheData('locales');
    // if (cacheLocales) {
    //   return cacheLocales;
    // }

    const { data } = await useFetchInstance('/api/settings/locales');
    // setCacheData('locales', data);
    return data;
  };

  const getCountries = async ():Promise<ICountry[]> => {
    // const cacheLocales = getCacheData('countries');
    // if (cacheLocales) {
    //   return cacheLocales;
    // }

    const { data } = await useFetchInstance('/api/settings/countries');
    // setCacheData('countries', data);
    return data;
  };

  const getCoreConstants = async ():Promise<ICoreConstants> => {
    // const cacheConstants = getCacheData('constants');
    // if (cacheConstants) {
    //   return cacheConstants;
    // }

    const { data } = await useFetchInstance('/api/settings/constants');
    // setCacheData('constants', data);
    return data;
  };

  const getInitUserInfo = async ():Promise<IInitUserInfo> => {
    const { data } = await useFetchInstance('/api/player/init');
    return data;
  };

  const sendContactMessage = async (requestData: IContactMessageRequest):Promise<{ message: string }> => {
    const { data } = await useFetchInstance('/api/notification/communications', { method: 'POST', body: requestData });
    return data;
  }

  return {
    getCurrencies,
    getLocales,
    getCountries,
    getCoreConstants,
    getInitUserInfo,
    sendContactMessage
  };
}

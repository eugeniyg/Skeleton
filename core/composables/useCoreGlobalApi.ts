import type {
  IContactMessageRequest,
  ICoreConstants,
  ICountry,
  ICurrency,
  IInitUserInfo,
  ILocale
} from '../types';
import { useFetchInstance } from '../assets/apiInstance';

export const useCoreGlobalApi = () => {
  const getCurrencies = async (visible?: number):Promise<ICurrency[]> => {
    const { data } = await useFetchInstance('/api/settings/currencies', { params: { visible } });
    return data;
  };

  const getLocales = async ():Promise<ILocale[]> => {
    const { data } = await useFetchInstance('/api/settings/locales');
    return data;
  };

  const getCountries = async ():Promise<ICountry[]> => {
    const { data } = await useFetchInstance('/api/settings/countries');
    return data;
  };

  const getCoreConstants = async ():Promise<ICoreConstants> => {
    const { data } = await useFetchInstance('/api/settings/constants');
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

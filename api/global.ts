import type { IContactMessageRequest, ICoreConstants, ICountry, ICurrency, IInitUserInfo, ILocale } from './types';
import { apiGuestInstance } from './apiGuestInstance';

export const getCurrencies = async (visible?: number): Promise<ICurrency[]> => {
  const { data } = await apiGuestInstance('/api/settings/currencies', { params: { visible } });
  return data;
};

export const getLocales = async (): Promise<ILocale[]> => {
  const { data } = await apiGuestInstance('/api/settings/locales');
  return data;
};

export const getCountries = async (): Promise<ICountry[]> => {
  const { data } = await apiGuestInstance('/api/settings/countries');
  return data;
};

export const getConstants = async (): Promise<ICoreConstants> => {
  const { data } = await apiGuestInstance('/api/settings/constants');
  return data;
};

export const getInitUserInfo = async (): Promise<IInitUserInfo> => {
  const { data } = await apiGuestInstance('/api/player/init');
  return data;
};

export const sendContactMessage = async (requestData: IContactMessageRequest): Promise<{ message: string }> => {
  const { data } = await apiGuestInstance('/api/notification/communications', {
    method: 'POST',
    body: requestData,
  });
  return data;
};

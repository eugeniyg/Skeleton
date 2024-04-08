import type { ICoreConstants, ICountry, ICurrency, ILocale } from "@skeleton/core/types";
import { useApiGuestInstance } from "@skeleton/core/assets/apiGuestInstance";

export const getCurrencies = cachedFunction(async (): Promise<ICurrency[]> => {
  const { data } = await useApiGuestInstance('/api/settings/currencies', { params: { visible: 1 } });
  return data;
}, {
  maxAge: 60 * 2,
  name: 'currencies'
});

export const getLocales = cachedFunction(async (): Promise<ILocale[]> => {
  const { data } = await useApiGuestInstance('/api/settings/locales');
  return data;
}, {
  maxAge: 60 * 2,
  name: 'locales'
});

export const getCountries = cachedFunction(async (): Promise<ICountry[]> => {
  const { data } = await useApiGuestInstance('/api/settings/countries');
  return data;
}, {
  maxAge: 60 * 2,
  name: 'countries'
});

export const getConstants = cachedFunction(async (): Promise<ICoreConstants> => {
  const { data } = await useApiGuestInstance('/api/settings/constants');
  return data;
}, {
  maxAge: 60 * 2,
  name: 'constants'
});
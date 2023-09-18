import {
  ICollection,
  ICoreConstants,
  ICountry,
  ICurrency,
  IGameProvider,
  ILocale
} from '../types';

interface ICoreCache extends Record<string, any> {
  currencies?: { value: ICurrency[], expire?: number };
  locales?: { value: ILocale[], expire?: number };
  countries?: { value: ICountry[], expire?: number };
  constants?: { value: ICoreConstants, expire?: number };
  collections?: { value: ICollection[], expire?: number };
  providers?: { value: IGameProvider[], expire?: number };
}

const coreCache:ICoreCache = {};

// ttl must be in milliseconds
export const setCacheData = (key:string, value:any, ttl?:number):void => {
  const expTime:number|undefined = Date.now() + (ttl || 1000 * 60 * 5);
  coreCache[key] = { value, expire: expTime };
}

export const getCacheData = (key:string) => {
  if (!coreCache[key]) {
    return undefined;
  }

  const nowTime = Date.now();
  const isExpired = coreCache[key].expire && nowTime >= coreCache[key].expire;

  if (isExpired) {
    coreCache[key] = undefined;
    return undefined;
  } else {
    return coreCache[key].value;
  }
}

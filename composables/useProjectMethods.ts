import { GameImagesInterface } from '@platform/frontend-core/dist/module';
import * as projectRules from './validationRules';
import { useGlobalStore } from '~/composables/useGlobalStore';
import fieldsTypeMap from '~/maps/fieldsTypeMap.json';
import { SeoContentInterface } from '~/types';

export const useProjectMethods = () => {
  const createValidationRules = (fields:any[], includeContext?:boolean):any => {
    const validationRules:any = {};
    const fieldsType:any = fieldsTypeMap;

    if (includeContext) {
      fields.forEach((field) => {
        if (field.isRequired) validationRules[field.name] = [{ rule: 'required' }];
        if (fieldsType[field.name].validation?.length) {
          if (validationRules[field.name]) {
            validationRules[field.name] = [...validationRules[field.name], ...fieldsType[field.name].validation];
          } else validationRules[field.name] = fieldsType[field.name].validation;
        }
      });
    } else {
      fields.forEach((field) => {
        if (fieldsType[field.name].validation?.length) {
          validationRules[field.name] = fieldsType[field.name].validation;
        }
      });
    }
    return validationRules;
  };

  const getFormRules = (fieldsRules:any):any => {
    const { validationMessages } = useGlobalStore();
    const { createFormRules } = useCoreMethods();
    return createFormRules(fieldsRules, projectRules, validationMessages);
  };

  const preloaderDone = ():void => {
    const preloaderEl = document.querySelector('.preloader');
    if (preloaderEl?.classList.contains('is-none')) return;

    setTimeout(() => {
      preloaderEl?.classList.add('is-hide');
    }, 500);

    setTimeout(() => {
      preloaderEl?.classList.add('is-none');
    }, 1000);
  };

  const localizePath = (path:string):string => {
    const globalStore = useGlobalStore();

    if (globalStore.currentLocale?.code.toLowerCase() === globalStore.defaultLocale?.code.toLowerCase()) return path;
    return `/${globalStore.currentLocale?.code.toLowerCase()}${!path || path === '/' ? '' : path}`;
  };

  const isHomePage = ():boolean => {
    const route = useRoute();
    return route.name === 'index' || route.name === 'locale-index';
  };

  const preloaderStart = ():void => {
    const preloaderEl = document.querySelector('.preloader');
    if (preloaderEl) preloaderEl.classList.value = 'preloader';
  };

  const getImageUrl = (imageData: GameImagesInterface, orientation: string):string => {
    if (orientation === 'vertical') return imageData['200x300']['3x'] || imageData['200x300']['2x'] || imageData['200x300']['1x'];
    return imageData['200x200']['3x'] || imageData['200x200']['2x'] || imageData['200x200']['1x'];
  };

  const getFormatDate = (dateUtcIsoString: string):string => {
    const date = new Date(dateUtcIsoString);
    return date.toLocaleString().slice(0, -3);
  };

  const getNicknameFromEmail = (email: string):string => {
    const getFirstPath = email.split('@')[0];
    if (getFirstPath.length < 4) return `${getFirstPath.slice(0, 1)}***`;
    return `${getFirstPath.slice(0, -3)}***`;
  };

  const formatBalance = (currency: string|undefined, amount: number|undefined):{ currency: string, amount: number } => {
    if (!currency && amount === undefined) return { currency: '', amount: 0 };
    if (!currency) return { currency: '', amount: amount || 0 };
    if (amount === undefined) return { currency, amount: 0 };

    const { currencies } = useGlobalStore();
    const currencyConfig = currencies.find((item) => item.code === currency);
    if (!currencyConfig) return { currency, amount };

    const specialCurrencies = ['BTC', 'ETH'];
    if (currencyConfig.type === 'fiat' || !specialCurrencies.includes(currencyConfig.code)) return { currency, amount };

    const subCurrencyConfig = currencyConfig.subCurrencies?.find((subCurrency) => subCurrency.subunitToUnit === 1000);
    if (amount === 0) return { currency: subCurrencyConfig?.code || '', amount };
    let afterDigits;
    if (amount.toString().split('e-')[1]) {
      afterDigits = Number(amount.toString().split('e-')[1]) || 0;
    } else {
      afterDigits = amount.toString().split('.')[1]?.length || 0;
    }

    return { currency: subCurrencyConfig?.code || '', amount: Number((amount * 1000).toFixed(afterDigits < 4 ? 0 : (afterDigits - 3))) };
  };

  const getMainBalanceFormat = (currency: string, amount: number):{ currency: string, amount: number } => {
    const { currencies } = useGlobalStore();
    const currencyConfig = currencies.find((item) => {
      if (!item.subCurrencies?.length) return item.code === currency;

      return item.subCurrencies.some((subCurrency) => subCurrency.code === currency);
    });
    if (!currencyConfig) return { currency, amount };
    const specialCurrencies = ['BTC', 'ETH'];
    if (currencyConfig.type === 'fiat' || !specialCurrencies.includes(currencyConfig.code)) return { currency, amount };

    const subCurrencyConfig = currencyConfig.subCurrencies?.find((subCurrency) => subCurrency.code === currency);
    if (amount === 0) return { currency: currencyConfig.code, amount };

    return { currency: currencyConfig.code, amount: amount / (subCurrencyConfig?.subunitToUnit || 1) };
  };

  const setPageSeo = (seoData:SeoContentInterface|undefined):void => {
    const globalStore = useGlobalStore();
    useHead({
      title: seoData?.title || globalStore.globalSeo?.title,
      meta: [
        {
          name: 'description',
          content: seoData?.description || globalStore.globalSeo?.description,
        },
      ],
    });
  };

  return {
    createValidationRules,
    getFormRules,
    preloaderDone,
    getImageUrl,
    preloaderStart,
    localizePath,
    isHomePage,
    getFormatDate,
    getNicknameFromEmail,
    formatBalance,
    getMainBalanceFormat,
    setPageSeo,
  };
};

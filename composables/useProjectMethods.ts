import { GameImagesInterface } from '@platform/frontend-core/dist/module';
import * as projectRules from './validationRules';
import { useGlobalStore } from '~/composables/useGlobalStore';
import fieldsTypeMap from '~/maps/fieldsTypeMap.json';
import { SeoContentInterface } from '~/types';
import { useLayoutStore } from '~/composables/useLayoutStore';

export const useProjectMethods = () => {
  const createValidationRules = (fields:any[], includeContext?:boolean):any => {
    const validationRules = {};

    if (includeContext) {
      fields.forEach((field) => {
        if (field.isRequired) validationRules[field.name] = [{ rule: 'required' }];
        if (fieldsTypeMap[field.name].validation?.length) {
          if (validationRules[field.name]) {
            validationRules[field.name] = [...validationRules[field.name], ...fieldsTypeMap[field.name].validation];
          } else validationRules[field.name] = fieldsTypeMap[field.name].validation;
        }
      });
    } else {
      fields.forEach((field) => {
        if (fieldsTypeMap[field.name].validation?.length) {
          validationRules[field.name] = fieldsTypeMap[field.name].validation;
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
    if (preloaderEl.classList.contains('is-none')) return;

    setTimeout(() => {
      preloaderEl.classList.add('is-hide');
    }, 500);

    setTimeout(() => {
      preloaderEl.classList.add('is-none');
    }, 1000);
  };

  const localizePath = (path:string):string => {
    const globalStore = useGlobalStore();

    if (globalStore.currentLocale.code.toLowerCase() === globalStore.defaultLocale.code.toLowerCase()) return path;
    return `/${globalStore.currentLocale.code.toLowerCase()}${!path || path === '/' ? '' : path}`;
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
    return imageData['200x200']['3x'] || imageData['200x300']['2x'] || imageData['200x300']['1x'];
  };

  const getFormatDate = (timeString: string):string => {
    const splitString = timeString.split(' ');
    const parseDate = splitString[0].split('-');
    const parseTime = splitString[1].split(':');
    const date = new Date(Date.UTC(+parseDate[0], +parseDate[1] - 1, +parseDate[2], +parseTime[0], +parseTime[1], +parseTime[2]));
    return date.toLocaleString().slice(0, -3);
  };

  const getNicknameFromEmail = (email: string):string => {
    const getFirstPath = email.split('@')[0];
    if (getFirstPath.length < 4) return `${getFirstPath.slice(0, 1)}***`;
    return `${getFirstPath.slice(0, -3)}***`;
  };

  const needToChangeLanguage = ():boolean => {
    const cookieLanguage = useCookie('user-language');
    const route = useRoute();
    return route.name && !route.params.locale && !!cookieLanguage.value;
  };

  const formatBalance = (currency: string, amount: number):{ currency: string, amount: string|number } => {
    const { currencies } = useGlobalStore();
    const currencyConfig = currencies.find((item) => item.code === currency);
    const specialCurrencies = ['BTC', 'ETH'];
    if (currencyConfig.type === 'fiat' || !specialCurrencies.includes(currencyConfig.code)) return { currency, amount };

    const subcurrencyConfig = currencyConfig.subCurrencies.find((subcurrency) => subcurrency.subunitToUnit === 1000);
    if (amount === 0) return { currency: subcurrencyConfig.code, amount };

    const afterDigits = amount.toString().split('.')[1]?.length || 0;

    return { currency: subcurrencyConfig.code, amount: (amount * 1000).toFixed(afterDigits < 4 ? 0 : (afterDigits - 3)) };
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
    needToChangeLanguage,
    formatBalance,
    setPageSeo,
  };
};

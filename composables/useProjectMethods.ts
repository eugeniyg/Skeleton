import type { IGameImages, IObserverOptions } from '@skeleton/core/types';
import get from 'lodash/get';
import * as projectRules from './validationRules';
import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
import type { ISeoBlock } from "~/types";

export const useProjectMethods = () => {
  const setFormData = (fields: any[]):any => {
    const formData:any = {};
    fields.forEach((field) => {
      formData[field.name || field.key] = field.value || '';
    })
    return formData;
  };

  const createCustomMessage = (params:any, message: string):string => {
    let newMessage = message;
    if (Object.prototype.hasOwnProperty.call(params, 'min')) {
      newMessage = newMessage.replace(/\{min}/g, params.min);
    }
    if (Object.prototype.hasOwnProperty.call(params, 'max')) {
      newMessage = newMessage.replace(/\{max}/g, params.max);
    }

    if (Object.prototype.hasOwnProperty.call(params, 'param')) {
      newMessage = newMessage.replace(/\{param}/g, params.param);
    }

    return newMessage;
  };

  const createFormRules = (fieldsRules: any, projectRules:any, validationMessages:any):any => {
    const formRules:any = {};

    Object.keys(fieldsRules).forEach((field) => {
      const rules:any = {};

      fieldsRules[field].forEach((item:any) => {
        if (!projectRules[item.rule]) { return };

        if (item.arguments) {
          // @ts-ignore
          rules[item.rule] = projectRules.helpers.withMessage(({ $params }) =>
            createCustomMessage($params, validationMessages[item.rule] || ''),
            projectRules[item.rule](item.arguments));
        } else {
          rules[item.rule] = projectRules.helpers.withMessage(validationMessages[item.rule] || '', projectRules[item.rule]);
        }
      })
      formRules[field] = rules;
    })
    return formRules;
  };

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
    const { fieldsSettings, defaultLocaleFieldsSettings } = useGlobalStore();
    const messages = { ...defaultLocaleFieldsSettings?.validationMessages, ...fieldsSettings?.validationMessages,  };
    const { createFormRules } = useProjectMethods();
    return createFormRules(fieldsRules, projectRules, messages);
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

  const localizePath = (path:string|undefined):string => {
    const globalStore = useGlobalStore();
    if (globalStore.currentLocale?.code.toLowerCase() === globalStore.defaultLocale?.code.toLowerCase()) {
      if (!path) return '';
      return path.startsWith('/') ? path : `/${path}`;
    }
    return `/${globalStore.currentLocale?.code.toLowerCase()}${!path || path === '/' ? '' : path}`;
  };

  const createSrcSet = (src?: string):string => {
    if (!src) return '';

    const webpSrc = src.replace(/\.\w+$/, '.webp');
    return `${webpSrc}, ${src}`;
  };

  const preloaderStart = ():void => {
    const preloaderEl = document.querySelector('.preloader');
    if (preloaderEl) preloaderEl.classList.value = 'preloader';
  };

  const getImageUrl = (imageData: IGameImages, orientation: string):string => {
    const imagePath = (orientation === 'vertical') ?
      (imageData['200x300']['3x'] || imageData['200x300']['2x'] || imageData['200x300']['1x']) :
      (imageData['200x200']['3x'] || imageData['200x200']['2x'] || imageData['200x200']['1x'])

    const { public: config } = useRuntimeConfig();

    return `${config.gamehubCdn}${imagePath}`;
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

  const setPageSeo = (seoData: Maybe<ISeoBlock>):void => {
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

  const sortByAlphabet = (a:string, b:string):number => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  };

  const getRandomInt = (min:number, max:number):number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const getContent = (
      contentData: any,
      defaultLocaleContentData: any,
      path: string,
  ): any => get(contentData, path) || get(defaultLocaleContentData, path);

  const getEquivalentAccount = (targetBalance: number|undefined, targetCurrency: string|undefined): {
    balance: number,
    currency: string,
    currencySymbol: string
  } => {
    const { baseCurrency, equivalentCurrency, currencies } = useGlobalStore();
    if (!baseCurrency || !equivalentCurrency) return { balance: 0, currency: '', currencySymbol: '' };
    const currentCurrency = currencies.find((currency) => currency.code === targetCurrency);
    if (!currentCurrency) return { balance: 0, currency: '', currencySymbol: '' };

    // here baseAmount will be in float
    const balanceInBaseCurrency = (targetBalance || 0) * (currentCurrency.subunitToUnit / currentCurrency.rate.rate);

    // convert to int + divide onto rate
    const equivalentAmount = balanceInBaseCurrency * (equivalentCurrency.rate.rate / baseCurrency.subunitToUnit);

    return {
      balance: Number(equivalentAmount.toFixed(2)),
      currency: equivalentCurrency.code,
      currencySymbol: equivalentCurrency.symbol,
    };
  };

  const getEquivalentFromBase = (baseAmount: number|undefined, targetCurrencyCode: string|undefined): {
    amount: number,
    currency: string,
  } => {
    const { currencies } = useGlobalStore();
    const targetCurrency = currencies.find((currency) => currency.code === targetCurrencyCode);

    if (!targetCurrency || !baseAmount) return { amount: 0, currency: '' };

    const balance = baseAmount * targetCurrency.rate.rate / targetCurrency.subunitToUnit;
    return formatBalance(targetCurrency.code, balance);
  };

  const getLocalesContentData = (currentLocaleContentResponse: any, defaultLocaleContentResponse: any): {
    currentLocaleData: any,
    defaultLocaleData: any
  } => {
    let currentLocaleData;
    let defaultLocaleData;

    if (currentLocaleContentResponse.status !== 'rejected') {
      const { data } = currentLocaleContentResponse.value;
      if (data) currentLocaleData = data.value;
    }

    if (defaultLocaleContentResponse.status !== 'rejected') {
      const { data } = defaultLocaleContentResponse.value;
      if (data) defaultLocaleData = data.value;
    }

    return { currentLocaleData, defaultLocaleData };
  };

  const initObserver = (el:any, options:IObserverOptions):void => {
    const optionsThing = {
      once: options?.once || false,
      onInView: options?.onInView,
      onOutView: options?.onOutView,
      settings: options?.settings || { root: null, rootMargin: '0px', threshold: 0.05 }
    };

    const inviewEvent = new Event('inview', { bubbles: false, cancelable: true });
    const outviewEvent = new Event('outview', { bubbles: false, cancelable: true });

    const callback = (entries:any, observer: any) => {
      entries.forEach((entry:any) => {
        if (entry.isIntersecting) {
          entry.target.dispatchEvent(inviewEvent);
          if (optionsThing.once) observer.unobserve(entry.target);
        } else {
          entry.target.dispatchEvent(outviewEvent);
        }
      })
    }

    const observer = new IntersectionObserver(callback, optionsThing.settings);
    observer.observe(el);
    el.addEventListener('inview', optionsThing.onInView);
    el.addEventListener('outview', optionsThing.onOutView);

    onBeforeUnmount(() => {
      observer.unobserve(el);
      el.removeEventListener('inview', optionsThing.onInView);
      el.removeEventListener('outview', optionsThing.onOutView);
    })
  };

  const replaceContent = (content:string, separator: string):string => {
    const pathArr = content.split(separator);
    let newString = '';
    pathArr.forEach((path, index) => {
      if (index % 2) {
        newString += `<span>${path}</span>`;
      } else {
        newString += `${path}`;
      }
    })
    return newString;
  };

  const getSumFromAmountItems = (
    exclusionItems?: { amount: number, currency: string }[],
    baseAmount?: number|null,
  ): string|undefined => {
    let sum: string|undefined;
    const { activeAccount } = useWalletStore();

    const exclusionItem = exclusionItems?.find(item => item.currency === activeAccount?.currency);

    if (exclusionItem) {
      const { amount, currency } = formatBalance(exclusionItem.currency, exclusionItem.amount);
      sum = `${amount} ${currency}`;
    }

    if (!sum && baseAmount) {
      const { amount, currency } = getEquivalentFromBase(baseAmount, activeAccount?.currency);
      sum = `${amount} ${currency}`;
    }

    return sum;
  };

  const addBetsyScript = ():HTMLElement => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://turboplatform-dev.betsy.gg/assets/sdk/init.js');
    script.setAttribute('defer', 'defer');
    document.head.append(script);
    return script;
  }

  return {
    createValidationRules,
    getFormRules,
    preloaderDone,
    getImageUrl,
    preloaderStart,
    localizePath,
    getNicknameFromEmail,
    formatBalance,
    getMainBalanceFormat,
    setPageSeo,
    sortByAlphabet,
    getContent,
    getEquivalentAccount,
    getLocalesContentData,
    setFormData,
    createFormRules,
    getRandomInt,
    initObserver,
    replaceContent,
    createSrcSet,
    getEquivalentFromBase,
    getSumFromAmountItems,
    addBetsyScript
  };
};

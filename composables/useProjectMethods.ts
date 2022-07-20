import { useGlobalMethods, GameImagesInterface } from '~/CORE';
import * as projectRules from './validationRules';
import { useGlobalStore } from '~/composables/useGlobalStore';
import fieldsTypeMap from '~/maps/fieldsTypeMap.json';

export const useProjectMethods = () => {
  const { validationMessages } = useGlobalStore();

  const createValidationRules = (fields:any[], includeContext?:boolean):any => {
    const validationRules = {};

    if (includeContext) {
      fields.forEach((field) => {
        if (field.isRequired) validationRules[field.name] = [{ rule: 'required' }];
        if (fieldsTypeMap[field.name].validation?.length) {
          validationRules[field.name] = [...validationRules[field.name], ...fieldsTypeMap[field.name].validation];
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
    const { createFormRules } = useGlobalMethods();
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
    const { currentLocale, defaultLocale } = useGlobalStore();

    if (currentLocale.code.toLowerCase() === defaultLocale.code.toLowerCase()) return path;
    return `/${currentLocale.code.toLowerCase()}${!path || path === '/' ? '' : path}`;
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

  return {
    createValidationRules,
    getFormRules,
    preloaderDone,
    getImageUrl,
    preloaderStart,
    localizePath,
    isHomePage,
    getFormatDate,
  };
};

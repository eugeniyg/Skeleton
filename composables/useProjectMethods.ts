import { useGlobalMethods } from '~/CORE/index';
import * as validationRules from './validationRules';
import { useGlobalStore } from '~/composables/useGlobalStore';
import { GameImagesInterface } from '~/types/gameTypes';

export const useProjectMethods = () => {
  const router = useRouter();
  const { validationMessages } = useGlobalStore();

  const navigate = (href:string):void => {
    router.push(href);
  };

  const getCurrentUrl = ():string => router.currentRoute.value.fullPath;

  const isHomePage = ():boolean => router.currentRoute.value.name === 'index';

  const getFormRules = (fields:any[], includeContext:boolean = false):any => {
    const { createFormRules } = useGlobalMethods();
    return createFormRules(fields, validationRules, validationMessages, includeContext);
  };

  const dispatchPreloaderDone = ():void => {
    const doneEvent = new Event('preloader:done', { bubbles: false, cancelable: true });
    document.dispatchEvent(doneEvent);
  };

  const getImageUrl = (imageData:GameImagesInterface, orientation:string):string => {
    if (orientation === 'vertical') return imageData['200x300']['3x'] || imageData['200x300']['2x'] || imageData['200x300']['1x'];
    return imageData['200x200']['3x'] || imageData['200x300']['2x'] || imageData['200x300']['1x'];
  };

  return {
    navigate,
    getCurrentUrl,
    isHomePage,
    getFormRules,
    dispatchPreloaderDone,
    getImageUrl,
  };
};

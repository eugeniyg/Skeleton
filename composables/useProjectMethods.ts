import { useGlobalMethods } from '~/CORE/index';
import * as validationRules from './validationRules';
import { useGlobalStore } from '~/composables/useGlobalStore';

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

  return {
    navigate,
    getCurrentUrl,
    isHomePage,
    getFormRules,
  };
};

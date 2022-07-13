import { rule } from 'postcss';

const useGlobalMethods = () => {
  const setFormData = (fields: any[]):any => {
    const formData:any = {};
    fields.forEach((field) => {
      formData[field.name || field.key] = field.value || '';
    });
    return formData;
  };

  const createCustomMessage = (params:any, message: string):string => {
    let newMessage = message;
    if (params.hasOwnProperty('min')) {
      newMessage = newMessage.replace(/\{min}/g, params.min);
    }
    if (params.hasOwnProperty('max')) {
      newMessage = newMessage.replace(/\{max}/g, params.max);
    }

    if (params.hasOwnProperty('param')) {
      newMessage = newMessage.replace(/\{param}/g, params.param);
    }

    return newMessage;
  };

  const createFormRules = (fieldsRules: any, projectRules:any, validationMessages:any):any => {
    const formRules:any = {};

    Object.keys(fieldsRules).forEach((field) => {
        const rules:any = {};

      fieldsRules[field].forEach((item:any) => {
          if (!projectRules[item.rule]) return;

          if (item.arguments) {
            // @ts-ignore
            rules[item.rule] = projectRules.helpers.withMessage(({ $params }) => createCustomMessage($params, validationMessages[item.rule]), projectRules[item.rule](item.arguments));
          } else {
            rules[item.rule] = projectRules.helpers.withMessage(validationMessages[item.rule], projectRules[item.rule]);
          }
        });
        formRules[field] = rules;
    });
    return formRules;
  };

  const getRandomInt = (min:number, max:number):number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const initObserver = (el:any, options:any):void => {
    const optionsThing = {
      onInView: options?.onInView,
      onOutView: options?.onOutView,
      settings: options?.settings || { root: null, rootMargin: '0px', threshold: 0.05 },
    };

    const inviewEvent = new Event('inview', { bubbles: false, cancelable: true });
    const outviewEvent = new Event('outview', { bubbles: false, cancelable: true });

    const callback = (entries) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (entry.isIntersecting) {
          entry.target.dispatchEvent(inviewEvent);
        } else {
          entry.target.dispatchEvent(outviewEvent);
        }
      }
    };

    const observer = new IntersectionObserver(callback, optionsThing.settings);
    observer.observe(el);
    el.addEventListener('inview', optionsThing.onInView);
    el.addEventListener('outview', optionsThing.onOutView);

    onBeforeUnmount(() => {
      observer.unobserve(el);
      el.removeEventListener('inview', optionsThing.onInView);
      el.removeEventListener('outview', optionsThing.onOutView);
    });
  };

  return {
    setFormData,
    createFormRules,
    getRandomInt,
    initObserver,
  };
};

export { useGlobalMethods };

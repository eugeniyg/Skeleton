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

  const createFormRules = (fields: any[], validationRules:any, validationMessages:any, includeContext:boolean = false):any => {
    const formRules:any = {};

    fields.forEach((field) => {
      if (field.validationRules.length || field.isRequired) {
        const rules:any = {};
        if (includeContext && field.isRequired) {
          rules.required = validationRules.helpers.withMessage(validationMessages.required, validationRules.required);
        }

        field.validationRules.forEach((rule:any) => {
          if (!validationRules[rule.rule]) return;

          if (rule.arguments) {
            // @ts-ignore
            rules[rule.rule] = validationRules.helpers.withMessage(({ $params }) => createCustomMessage($params, validationMessages[rule.rule]), validationRules[rule.rule](rule.arguments));
          } else {
            rules[rule.rule] = validationRules.helpers.withMessage(validationMessages[rule.rule], validationRules[rule.rule]);
          }
        });
        formRules[field.name] = rules;
      }
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

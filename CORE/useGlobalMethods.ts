const useGlobalMethods = () => {
  const setFormData = (fields: any[]):any => {
    const formData:any = {};
    fields.forEach((field) => {
      formData[field.name] = field.value || '';
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

  return {
    setFormData,
    createFormRules,
  };
};

export { useGlobalMethods };

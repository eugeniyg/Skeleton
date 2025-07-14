import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
import * as projectRules from './validationRules';

export const setFormData = (fields: any[]): any => {
  const formData: any = {};
  fields.forEach(field => {
    formData[field.name || field.key] = field.value || '';
  });
  return formData;
};

const createCustomMessage = (params: any, message: string): string => {
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

const createFormRules = (fieldsRules: any, projectRules: any, validationMessages: any): any => {
  const formRules: any = {};

  Object.keys(fieldsRules).forEach(field => {
    const rules: any = {};

    fieldsRules[field].forEach((item: any) => {
      if (!projectRules[item.rule]) {
        return;
      }

      if (item.arguments) {
        rules[item.rule] = projectRules.helpers.withMessage(
          ({ $params }: { $params: any }) => createCustomMessage($params, validationMessages[item.rule] || ''),
          projectRules[item.rule](item.arguments)
        );
      } else {
        rules[item.rule] = projectRules.helpers.withMessage(
          validationMessages[item.rule] || '',
          projectRules[item.rule]
        );
      }
    });
    formRules[field] = rules;
  });
  return formRules;
};

export const createValidationRules = (fields: any[], includeContext?: boolean): any => {
  const validationRules: any = {};
  const fieldsType: any = fieldsTypeMap;

  if (includeContext) {
    fields.forEach(field => {
      if (field.isRequired) validationRules[field.name] = [{ rule: 'required' }];
      if (fieldsType[field.name]?.validation?.length) {
        if (validationRules[field.name]) {
          validationRules[field.name] = [...validationRules[field.name], ...fieldsType[field.name].validation];
        } else validationRules[field.name] = fieldsType[field.name].validation;
      }
    });
  } else {
    fields.forEach(field => {
      if (fieldsType[field.name]?.validation?.length) {
        validationRules[field.name] = fieldsType[field.name].validation;
      }
    });
  }
  return validationRules;
};

export const getFormRules = (fieldsRules: any): any => {
  const { fieldsSettings, defaultLocaleFieldsSettings } = useGlobalStore();
  const messages = { ...defaultLocaleFieldsSettings?.validationMessages, ...fieldsSettings?.validationMessages };
  return createFormRules(fieldsRules, projectRules, messages);
};

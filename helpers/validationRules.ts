import * as validationRules from '@vuelidate/validators';
import { isValidPhoneNumber } from 'libphonenumber-js';

export * from '@vuelidate/validators';

export const countryCode = (value: any): boolean => !validationRules.helpers.req(value) || /^[A-Z]{2}$/.test(value);

export const languageCode = (value: any): boolean => !validationRules.helpers.req(value) || /^[a-z]{2}$/.test(value);

export const phone = (value: any): boolean => !validationRules.helpers.req(value) || isValidPhoneNumber(`+${value}`);

export const lowercase = (value: any): boolean => !validationRules.helpers.req(value) || value.toLowerCase() === value;

export const uppercase = (value: any): boolean => !validationRules.helpers.req(value) || value.toUpperCase() === value;

export const accepted = (value: any): boolean =>
  !validationRules.helpers.req(value) || ['yes', 'on', 1, true].includes(value);

export const declined = (value: any): boolean =>
  !validationRules.helpers.req(value) || ['no', 'off', 0, false].includes(value);

function isValidDate(dateString: any) {
  let testDate;
  if (typeof dateString === 'number') {
    testDate = new Date(dateString);
    if (typeof testDate === 'object') {
      return true;
    }
  }

  const regexDate = /^\d{4}-\d{1,2}-\d{1,2}$/;

  if (!regexDate.test(dateString)) {
    return false;
  }

  const parts = dateString.split('-');
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[0], 10);

  if (year < 1000 || year > 3000 || month === 0 || month > 12) {
    return false;
  }

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }

  return day > 0 && day <= monthLength[month - 1];
}

export const before = (param: string) =>
  validationRules.helpers.withParams({ param }, (value: string) => {
    if (!validationRules.helpers.req(value)) return true;

    if (!isValidDate(param)) {
      return false;
    }
    if (!isValidDate(value)) {
      return false;
    }

    if (new Date(param).getTime() > new Date(value).getTime()) {
      return true;
    }

    return false;
  });

export const before_or_equal = (param: string) =>
  validationRules.helpers.withParams({ param }, (value: string) => {
    if (!validationRules.helpers.req(value)) return true;

    if (!isValidDate(param)) {
      return false;
    }
    if (!isValidDate(value)) {
      return false;
    }

    if (new Date(param).getTime() >= new Date(value).getTime()) {
      return true;
    }

    return false;
  });

export const after = (param: string) =>
  validationRules.helpers.withParams({ param }, (value: string) => {
    if (!validationRules.helpers.req(value)) return true;

    if (!isValidDate(param)) {
      return false;
    }
    if (!isValidDate(value)) {
      return false;
    }

    if (new Date(param).getTime() < new Date(value).getTime()) {
      return true;
    }

    return false;
  });

export const after_or_equal = (param: string) =>
  validationRules.helpers.withParams({ param }, (value: string) => {
    if (!validationRules.helpers.req(value)) return true;

    if (!isValidDate(param)) {
      return false;
    }
    if (!isValidDate(value)) {
      return false;
    }

    if (new Date(param).getTime() <= new Date(value).getTime()) {
      return true;
    }

    return false;
  });

export const alpha_dash = (value: any): boolean =>
  !validationRules.helpers.req(value) || /^[a-zA-Z0-9_-]+$/.test(value);

export const alpha_num = validationRules.alphaNum;

export const array = (value: any): boolean => !validationRules.helpers.req(value) || value instanceof Array;

export const boolean = (value: any): boolean =>
  !validationRules.helpers.req(value) || [true, false, 1, 0, '1', '0'].includes(value);

export const confirmed = (param: string) =>
  validationRules.helpers.withParams({ param }, value => {
    if (!validationRules.helpers.req(value)) return true;
    const getInput: any = document.querySelector(`input[name="${param}"]`);
    if (getInput) {
      return getInput.value === value;
    }
    return false;
  });

export const date = (value: string): boolean => !validationRules.helpers.req(value) || isValidDate(value);

export const date_equals = (param: string) =>
  validationRules.helpers.withParams({ param }, (value: string) => {
    if (!validationRules.helpers.req(value)) return true;

    if (!isValidDate(param)) {
      return false;
    }
    if (!isValidDate(value)) {
      return false;
    }

    if (new Date(param).getTime() === new Date(value).getTime()) {
      return true;
    }

    return false;
  });

export const different = (param: string) =>
  validationRules.helpers.withParams({ param }, value => {
    if (!validationRules.helpers.req(value)) return true;
    const getInput: any = document.querySelector(`input[name="${param}"]`);
    if (getInput) {
      return String(getInput.value) !== value;
    }
    return false;
  });

function getParameters(ruleValue: any) {
  let value = [];

  if (typeof ruleValue === 'string') {
    value = ruleValue.split(',');
  }

  if (typeof ruleValue === 'number') {
    value.push(ruleValue);
  }

  if (ruleValue instanceof Array) {
    value = ruleValue;
  }

  return value;
}

export const digits = (param: string) =>
  validationRules.helpers.withParams({ param }, (value: any) => {
    if (!validationRules.helpers.req(value)) return true;

    const num = Number(value);

    if (typeof num === 'number' && !isNaN(num) && typeof value !== 'boolean') {
      return String(value.trim()).length === parseInt(param, 10);
    }
    return false;
  });

export const digits_between = (param: string) => {
  const params = getParameters(param);
  const min = parseFloat(params[0]);
  const max = parseFloat(params[1]);

  return validationRules.helpers.withParams({ min, max }, value => {
    if (!validationRules.helpers.req(value)) return true;

    const num = Number(value);
    const valueDigitsCount = String(value).length;

    if (typeof num === 'number' && !isNaN(num) && typeof value !== 'boolean') {
      return valueDigitsCount >= min && valueDigitsCount <= max;
    }
    return false;
  });
};

export const ip = validationRules.ipAddress;

export const numeric = validationRules.numeric;

export const integer = validationRules.integer;

export const mac_address = validationRules.macAddress;

function getSize(value: any) {
  if (value instanceof Array) {
    return value.length;
  }

  if (typeof value === 'number') {
    return value;
  }

  return value.length;
}

export const max = (param: string) =>
  validationRules.helpers.withParams({ param }, value => {
    if (!validationRules.helpers.req(value)) return true;

    const size = getSize(value);

    return size <= param;
  });

export const min = (param: string) =>
  validationRules.helpers.withParams({ param }, value => {
    if (!validationRules.helpers.req(value)) return true;

    const size = getSize(value);

    return size >= param;
  });

export const regex = (param: any) =>
  validationRules.helpers.withParams({ param }, (value: any) => {
    if (!validationRules.helpers.req(value)) return true;

    const testRegexp = (reg: string) => {
      let flags = reg.replace(/.*\/([gimuyvsd]{1,8})$/, '$1');
      if (flags === reg) flags = '';

      let pattern;
      if (flags) {
        pattern = reg.replace(new RegExp('^/?(.*?)/' + flags + '$'), '$1');
      } else {
        pattern = reg.replace(new RegExp('^/?(.*?)/?$'), '$1');
      }

      const paramRegexp = new RegExp(pattern, flags);
      return paramRegexp.test(value);
    };

    return Array.isArray(param) ? param.some(item => testRegexp(item)) : testRegexp(param);
  });

export const not_regex = (param: any) =>
  validationRules.helpers.withParams({ param }, (value: any) => {
    if (!validationRules.helpers.req(value)) return true;

    const mod = /[g|i|m]{1,3}$/;
    let flag = param.match(mod);
    flag = flag ? flag[0] : '';

    const regexMain = param.replace(mod, '').slice(1, -1);
    const paramRegexp = new RegExp(regexMain, flag);
    return !paramRegexp.test(value);
  });

export const required_if = (param: string) =>
  validationRules.helpers.withParams({ param }, value => {
    if (!validationRules.helpers.req(value)) return true;

    const getInput: any = document.querySelector(`input[name="${param}"]`);
    if (getInput) {
      return !!String(getInput.value).length;
    }
    return false;
  });

export const string = (value: any): boolean => !validationRules.helpers.req(value) || typeof value === 'string';

export const minAge = (param: string) =>
  validationRules.helpers.withParams({ param }, (value: string) => {
    if (!validationRules.helpers.req(value)) return true;

    if (!isValidDate(value)) {
      return false;
    }
    const today: Date = new Date();
    const birthDay: Date = new Date(value);
    // @ts-expect-error - Date is number in milliseconds
    const ageInMilliseconds: number = today - birthDay;
    const ageInYear = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365);
    return ageInYear >= Number(param);
  });

export const maxAge = (param: string) =>
  validationRules.helpers.withParams({ param }, (value: string) => {
    if (!validationRules.helpers.req(value)) return true;

    if (!isValidDate(value)) {
      return false;
    }
    const today: Date = new Date();
    const birthDay: Date = new Date(value);
    // @ts-expect-error - Date is number in milliseconds
    const ageInMilliseconds: number = today - birthDay;
    const ageInYear = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365);
    return ageInYear <= Number(param);
  });

const isValidCpf = (cpf: string): boolean => {
  const cpfOnlyDigits = cpf.replace(/[^\d]+/g, '');
  if (cpfOnlyDigits.length !== 11 || /^(\d)\1{10}$/.test(cpfOnlyDigits)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfOnlyDigits.charAt(i)) * (10 - i);
  }
  let rest = sum % 11;
  const digit1 = rest < 2 ? 0 : 11 - rest;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpfOnlyDigits.charAt(i)) * (11 - i);
  }
  rest = sum % 11;
  const digit2 = rest < 2 ? 0 : 11 - rest;
  return digit1 === parseInt(cpfOnlyDigits.charAt(9)) && digit2 === parseInt(cpfOnlyDigits.charAt(10));
};
export const cpf_number = (value: string): boolean => !validationRules.helpers.req(value) || isValidCpf(value);

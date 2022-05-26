import { defineStore } from 'pinia';
import { countryInterface, currencyInterface, timeZoneInterface } from '~/types/globalDataTypes';

export type fieldsStoreStateType = {
  selectOptions: {
    currency: currencyInterface[],
    country: countryInterface[],
    timeZone: timeZoneInterface[],
  },
}

export const useFieldsStore = defineStore('fieldsStore', {
  state: () => ({
    selectOptions: {
      currency: [],
      country: [],
      timeZone: [],
    },
  } as fieldsStoreStateType),

  actions: {
    setOptions(optionName: string, options: any[]):void {
      if (optionName === 'currency') {
        this.selectOptions[optionName] = options.map((option) => ({ ...option, value: option.code }));
      } else if (optionName === 'country') {
        this.selectOptions[optionName] = options.map((option) => ({
          ...option,
          value: option.nativeName,
          mask: `/img/flags/${option.code.toLowerCase()}.svg`,
        }));
      } else if (optionName === 'timeZone') {
        this.selectOptions[optionName] = options.map((option) => ({ code: option.id, value: option.name }));
      } else this.selectOptions[optionName] = options;
    },
  },
});

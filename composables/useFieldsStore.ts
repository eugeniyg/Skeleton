import { defineStore } from 'pinia';
import { countryInterface, currencyInterface } from '~/types/globalDataTypes';

export type fieldsStoreStateType = {
  selectOptions: {
    currency: currencyInterface[],
    country: countryInterface[],
  }
}

export const useFieldsStore = defineStore('fieldsStore', {
  state: () => ({
    selectOptions: {
      currency: [],
      country: [],
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
      } else this.selectOptions[optionName] = options;
    },
  },
});

import { defineStore } from 'pinia';
import { countryInterface, currencyInterface, timeZoneInterface } from '~/types/globalDataTypes';
import { gameProviderInterface } from '~/types/gameTypes';

export type fieldsStoreStateType = {
  selectOptions: {
    currency: currencyInterface[],
    country: countryInterface[],
    timeZone: timeZoneInterface[],
    providers: gameProviderInterface[],
  },
}

export const useFieldsStore = defineStore('fieldsStore', {
  state: () => ({
    selectOptions: {
      currency: [],
      country: [],
      timeZone: [],
      providers: [],
    },
  } as fieldsStoreStateType),

  actions: {
    setOptions(optionName: string, options: any[]):void {
      if (optionName === 'currency') {
        this.selectOptions[optionName] = options.map((option) => ({ ...option, value: option.code }));
      } else if (optionName === 'country') {
        this.selectOptions[optionName] = options.map((option) => ({
          ...option,
          value: option.name,
          mask: `/img/flags/${option.code.toLowerCase()}.svg`,
        }));
      } else if (optionName === 'timeZone') {
        this.selectOptions[optionName] = options.map((option) => ({
          ...option,
          code: option.id,
          value: option.name,
        }));
      } else if (optionName === 'providers') {
        const allProvidersItem = {
          id: 'all',
          identity: 'all',
          code: 'all',
          value: 'All Providers',
        };
        const optionsArr = options.map((option) => ({
          ...option,
          code: option.id,
          value: option.identity,
        }));
        this.selectOptions[optionName] = [allProvidersItem, ...optionsArr];
      } else {
        this.selectOptions[optionName] = options.map((option) => ({
          ...option,
          code: option.code || option.id,
          value: option.name || option.identity,
        }));
      }
    },
  },
});

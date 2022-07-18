import { defineStore } from 'pinia';
import {
  CountryInterface,
  CurrencyInterface,
  TimeZoneInterface,
  GameProviderInterface,
} from 'CORE';

export type FieldsStoreStateType = {
  selectOptions: {
    currency: CurrencyInterface[],
    country: CountryInterface[],
    timeZone: TimeZoneInterface[],
    providers: GameProviderInterface[],
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
  } as FieldsStoreStateType),

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
          value: option.name,
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

import { defineStore } from 'pinia';
import type { ICountry, ICurrency, IField, ITimeZone } from '@skeleton/core/types';

interface IFieldsStoreState {
  profileFields: IField[];
  registrationFields: IField[];
}

interface ISelectOptions extends Record<string, any> {
  currency: ICurrency[];
  country: ICountry[];
  timeZone: ITimeZone[];
}

export const useFieldsStore = defineStore('fieldsStore', {
  state: (): IFieldsStoreState => ({
    profileFields: [],
    registrationFields: [],
  }),

  getters: {
    selectOptions(): ISelectOptions {
      const globalStore = useGlobalStore();
      return {
        currency: globalStore.currenciesSelectOptions,
        country: globalStore.countriesSelectOptions,
        timeZone: globalStore.timeZonesSelectOptions,
      };
    },
  },

  actions: {
    async getProfileFields(): Promise<void> {
      const { getProfileFields } = useCoreProfileApi();
      this.profileFields = await getProfileFields();
    },

    async getRegistrationFields(): Promise<void> {
      const { getRegistrationFields } = useCoreAuthApi();
      this.registrationFields = await getRegistrationFields();
    },
  },
});

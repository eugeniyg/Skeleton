import {defineStore} from 'pinia';
import {
  ICountry,
  ICurrency,
  IField,
  IGameProvider,
  ITimeZone
} from '@skeleton/core/types';

interface IFieldsStoreState {
  profileFields: IField[],
}

interface ISelectOptions {
  currency: ICurrency[],
  country: ICountry[],
  timeZone: ITimeZone[],
  providers: IGameProvider[],
}

export const useFieldsStore = defineStore('fieldsStore', {
  state: ():IFieldsStoreState => ({
    profileFields: [],
  }),

  getters: {
    selectOptions():ISelectOptions {
      const globalStore = useGlobalStore();
      const gameStore = useGamesStore();
      return {
        currency: globalStore.currenciesSelectOptions,
        country: globalStore.countriesSelectOptions,
        timeZone: globalStore.timeZonesSelectOptions,
        providers: gameStore.providersSelectOptions,
      };
    },
  },

  actions: {
    async getProfileFields():Promise<void> {
      const { getProfileFields } = useCoreProfileApi();
      this.profileFields = await getProfileFields();
    },
  },
});

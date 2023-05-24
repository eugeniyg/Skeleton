import { defineStore } from 'pinia';
import {
  CountryInterface,
  CurrencyInterface,
  TimeZoneInterface,
  GameProviderInterface,
  FieldInterface,
} from '@platform/frontend-core/dist/module';
import { useGlobalStore } from '~/composables/useGlobalStore';
import { useGamesStore } from '~/composables/useGamesStore';

interface FieldsStoreStateInterface {
  profileFields: FieldInterface[],
}

interface SelectOptionsInterface {
  currency: CurrencyInterface[],
  country: CountryInterface[],
  timeZone: TimeZoneInterface[],
  providers: GameProviderInterface[],
}

export const useFieldsStore = defineStore('fieldsStore', {
  state: ():FieldsStoreStateInterface => ({
    profileFields: [],
  }),

  getters: {
    selectOptions():SelectOptionsInterface {
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
      const data = await getProfileFields();
      this.profileFields = data;
    },
  },
});

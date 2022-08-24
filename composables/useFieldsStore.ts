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

export type FieldsStoreStateType = {
  profileFields: FieldInterface[],
  registrationFields: FieldInterface[],
}

interface SelectOptionsInterface {
  currency: CurrencyInterface[],
  country: CountryInterface[],
  timeZone: TimeZoneInterface[],
  providers: GameProviderInterface[],
}

export const useFieldsStore = defineStore('fieldsStore', {
  state: () => ({
    profileFields: [],
    registrationFields: [],
  } as FieldsStoreStateType),

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
    async getRegistrationFields():Promise<void> {
      const { getRegistrationFields } = useCoreAuthApi();
      const data = await getRegistrationFields();
      this.registrationFields = data;
    },

    async getProfileFields():Promise<void> {
      const { getProfileFields } = useCoreProfileApi();
      const data = await getProfileFields();
      this.profileFields = data;
    },
  },
});

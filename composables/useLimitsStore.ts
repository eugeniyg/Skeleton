import { defineStore } from 'pinia';

import { CreateLimitInterface, PlayerLimitInterface } from '@platform/frontend-core/dist/module';
import { ProfileLimitsContentInterface } from '~/types';

interface LimitsStateInteface {
  activeLimits: PlayerLimitInterface[],
  isLoaded: boolean,
  limitsContent: ProfileLimitsContentInterface | undefined,
  defaultLimitsContent: ProfileLimitsContentInterface | undefined,
}

export const useLimitsStore = defineStore('limitsStore', {
  state: (): LimitsStateInteface => ({
    activeLimits: [],
    isLoaded: false,
    limitsContent: undefined,
    defaultLimitsContent: undefined,
  }),
  actions: {
    async getLimits():Promise<void> {
      const { getPlayerLimits } = useCoreProfileApi();
      const data = await getPlayerLimits();
      this.activeLimits = data;
    },
    async createLimit(payload: CreateLimitInterface) :Promise<void> {
      const { createPlayerLimit } = useCoreProfileApi();
      await createPlayerLimit({ ...payload });
    },
    setLimitsContent(content: ProfileLimitsContentInterface, defaultContent: ProfileLimitsContentInterface) {
      this.limitsContent = content;
      this.defaultLimitsContent = defaultContent;
    },
  },

  // getters: {
  //   limitsTextContent(state) {
  //     return state.limitsContent;
  //   },
  // },
});

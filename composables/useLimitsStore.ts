import { defineStore } from 'pinia';

import { CreateLimitInterface, PlayerLimitInterface } from '@platform/frontend-core/dist/module';

interface LimitsStateInteface {
  activeLimits: PlayerLimitInterface[],
  isLoaded: boolean,
}

export const useLimitsStore = defineStore('limitsStore', {
  state: (): LimitsStateInteface => ({
    activeLimits: [],
    isLoaded: false,
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
    log() {
      console.log(123);
    },
  },

  getters: {
    showLog() {
      //this.log();
    },
  },
});

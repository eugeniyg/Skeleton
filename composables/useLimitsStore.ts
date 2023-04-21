import { defineStore } from 'pinia';

import { CreateLimitInterface, PlayerLimitInterface } from '@platform/frontend-core/dist/module';

interface LimitsStateInteface {
  activeLimits: PlayerLimitInterface[]
}

export const useLimitsStore = defineStore('limitsStore', {
  state: (): LimitsStateInteface => ({
    activeLimits: [],
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
  },
});

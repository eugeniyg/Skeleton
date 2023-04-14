import { defineStore } from 'pinia';

import { PlayerLimitInterface } from '@platform/frontend-core/dist/module';

interface LimitsStateInteface {
  limits: PlayerLimitInterface[]
}

export const useLimitsStore = defineStore('limitsStore', {
  state: (): LimitsStateInteface => ({
    limits: [],
  }),
  actions: {
    async getLimits():Promise<void> {
      const { getPlayerLimits } = useCoreProfileApi();
      const data = await getPlayerLimits();
      this.limits = data;
    },
  },
});

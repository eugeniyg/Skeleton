import { defineStore } from 'pinia';

export const useLimitsStore = defineStore('limitsStore', {
  state: () => ({
    limitsDefinitions: [],
    limitsStatuses: [],
    limitsPeriods: [],
    limitsCashPeriod: [],
    limitsCoolingOffPeriod: [],
    limitsSelfExclusionPeriod: [],
  }),
  actions: {
    async setLimitConstants():Promise<void> {
      const { getCoreConstants } = useCoreGlobalApi();
      const data = await getCoreConstants();

      console.log(data);

      this.limitsDefinitions = data.player.limit.definition;
      this.limitsStatuses = data.player.limit.status;
      this.limitsPeriods = data.player.limit.allPeriod;
      this.limitsCashPeriod = data.player.limit.cashPeriod;
      this.limitsCoolingOffPeriod = data.player.limit.coolingOffPeriod;
      this.limitsSelfExclusionPeriod = data.player.limit.selfExclusionPeriod;
    },
  },
});

import { defineStore } from 'pinia';

import { CreateLimitInterface, PlayerLimitInterface } from '@platform/frontend-core/dist/module';
import { ProfileLimitsContentInterface } from '~/types';
import { useGlobalStore } from '~/composables/useGlobalStore';

interface LimitsModalInterface {
  addLimit: boolean,
  editLimit: boolean,
  exceededLimitConfirm: boolean,
  confirmLimitUpdate: boolean,
}

interface LimitsStateInteface {
  activeLimits: PlayerLimitInterface[],
  isLoaded: boolean,
  limitsContent: Maybe<ProfileLimitsContentInterface>,
  defaultLimitsContent: Maybe<ProfileLimitsContentInterface>,
  modals: LimitsModalInterface
}

const transformToPeriods = (limits: PlayerLimitInterface[]) => {
  const periods = ['daily', 'weekly', 'monthly'];

  return periods.map((period) => ({
    title: period,
    items: limits.filter((limit) => limit.period === period) || [],
  }))
    .filter((column) => column.items.length);
};

export const useLimitsStore = defineStore('limitsStore', {
  state: (): LimitsStateInteface => ({
    activeLimits: [],
    isLoaded: false,
    limitsContent: undefined,
    defaultLimitsContent: undefined,
    modals: {
      addLimit: false,
      editLimit: false,
      exceededLimitConfirm: false,
      confirmLimitUpdate: false,
    },
  }),

  actions: {
    async getLimits():Promise<void> {
      const { getPlayerLimits } = useCoreProfileApi();
      this.activeLimits = await getPlayerLimits();
    },

    async createLimit(payload: CreateLimitInterface) :Promise<void> {
      const { createPlayerLimit } = useCoreProfileApi();
      await createPlayerLimit(payload);
    },

    setLimitsContent(content: Maybe<ProfileLimitsContentInterface>, defaultContent: Maybe<ProfileLimitsContentInterface>) {
      this.limitsContent = content;
      this.defaultLimitsContent = defaultContent;
    },

    showModal(modalName: keyof LimitsModalInterface) {
      this.modals[modalName] = true;
    },

    closeModal(modalName: keyof LimitsModalInterface) {
      this.modals[modalName] = false;
    },
  },

  getters: {
    betPeriods(state) {
      const limits = state.activeLimits.filter((limit) => limit.definition === 1);
      return transformToPeriods(limits) || [];
    },

    lossPeriods(state) {
      const limits = state.activeLimits.filter((limit) => limit.definition === 2);
      return transformToPeriods(limits) || [];
    },

    depositPeriods(state) {
      const limits = state.activeLimits.filter((limit) => limit.definition === 3);
      return transformToPeriods(limits) || [];
    },

    selfExclusionLimits(state) {
      return state.activeLimits.filter((limit) => limit.definition === 4);
    },

    coolingOffLimits(state) {
      return state.activeLimits.filter((limit) => limit.definition === 5);
    },

    limitCashPeriod() {
      const { settingsConstants } = useGlobalStore();
      console.log(settingsConstants?.player.limit.coolingOffPeriod)
      return settingsConstants?.player.limit.cashPeriod || [];
    },

    coolingOffPeriod() {
      const { settingsConstants } = useGlobalStore();
      return settingsConstants?.player.limit.coolingOffPeriod.map((period) => ({
        value: period.name,
        code: period.id,
      })) || [];
    },

    selfExclusionPeriod() {
      const { settingsConstants } = useGlobalStore();
      return settingsConstants?.player.limit.selfExclusionPeriod.map((period) => ({
        value: period.name,
        code: period.id,
      })) || [];
    },

  },
});

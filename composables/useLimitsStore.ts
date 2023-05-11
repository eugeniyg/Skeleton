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

interface ColumnsInterface {
  deposit: number|null,
  loss: number,
  bet: number
}

interface LimitsStateInteface {
  activeLimits: PlayerLimitInterface[],
  isLoaded: boolean,
  limitsContent: Maybe<ProfileLimitsContentInterface>,
  defaultLimitsContent: Maybe<ProfileLimitsContentInterface>,
  modals: LimitsModalInterface,
  columns: ColumnsInterface
}

const transformToPeriods = (limits: PlayerLimitInterface[]) => {
  const periods = ['daily', 'weekly', 'monthly'];

  return periods.map((period) => ({
    title: period,
    items: limits.filter((limit) => limit.period === period) || [],
  }))
    .filter((column) => column.items.length);
};

const mapKeys: Record<any, string> = {
  deposit: 'D',
  loss: 'L',
  bet: 'B',
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
    columns: {
      deposit: 0,
      loss: 0,
      bet: 0,
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

    setColumns(key: keyof ColumnsInterface, size: number) {
      this.columns[key] = size;
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
      return settingsConstants?.player.limit.cashPeriod || [];
    },

    coolingOffPeriod() {
      const { settingsConstants } = useGlobalStore();
      const { getContent } = useProjectMethods();
      const content = getContent(this.limitsContent, this.defaultLimitsContent, 'periodOptions');

      return settingsConstants?.player.limit.coolingOffPeriod.map((period) => ({
        value: content[period.id],
        code: period.id,
      })) || [];
    },

    selfExclusionPeriod() {
      const { settingsConstants } = useGlobalStore();
      const { getContent } = useProjectMethods();
      const content = getContent(this.limitsContent, this.defaultLimitsContent, 'periodOptions');

      return settingsConstants?.player.limit.selfExclusionPeriod.map((period) => ({
        value: content[period.id],
        code: period.id,
      })) || [];
    },

    getColumns(state) {
      const columns = Object.entries(state.columns)
        //.filter((entry) => entry.includes(0));

      return columns.map((entry) => {
        const [key, value] = entry;
        return `${mapKeys[key]}${value}`;
      }).join('-');
    },
  },
});

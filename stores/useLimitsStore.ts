import type { ICreateLimit, ICurrency, IPlayerLimit } from '@skeleton/core/types';
import type { IProfileLimits } from '~/types';

interface ILimitsState {
  activeLimits: IPlayerLimit[];
  isLoaded: boolean;
  limitsContent: Maybe<IProfileLimits>;
  defaultLimitsContent: Maybe<IProfileLimits>;
  isAdvancedModeEnabled: boolean;
}

const transformToPeriods = (limits: IPlayerLimit[]) => {
  const periods = ['daily', 'weekly', 'monthly'];

  return periods
    .map(period => ({
      title: period,
      items: limits.filter(limit => limit.period === period) || [],
    }))
    .filter(column => column.items.length);
};

export const useLimitsStore = defineStore('limitsStore', {
  state: (): ILimitsState => ({
    activeLimits: [],
    isLoaded: false,
    limitsContent: undefined,
    defaultLimitsContent: undefined,
    isAdvancedModeEnabled: false,
  }),

  actions: {
    async getLimits(): Promise<void> {
      const { getPlayerLimits } = useCoreProfileApi();
      this.activeLimits = await getPlayerLimits();
    },

    async createLimit(payload: ICreateLimit): Promise<void> {
      const { createPlayerLimit } = useCoreProfileApi();
      await createPlayerLimit(payload);
    },

    setLimitsContent(content: Maybe<IProfileLimits>, defaultContent: Maybe<IProfileLimits>) {
      this.limitsContent = content;
      this.defaultLimitsContent = defaultContent;
    },

    checkCurrencies(periods: { title: string; items: IPlayerLimit[] }[], currencies: ICurrency[]) {
      const currencyCodes = currencies.map(currency => currency.code);

      return (
        periods.length > 2 &&
        periods.every(period => {
          const periodCurrencyCodes = period.items.map(item => item.currency);
          return currencyCodes.every(code => periodCurrencyCodes.includes(code));
        })
      );
    },

    toogleAdvancedMode(): void {
      this.isAdvancedModeEnabled = !this.isAdvancedModeEnabled;
    },
  },

  getters: {
    betPeriods(state) {
      const limits = state.activeLimits.filter(limit => limit.definition === 1);
      return transformToPeriods(limits) || [];
    },

    lossPeriods(state) {
      const limits = state.activeLimits.filter(limit => limit.definition === 2);
      return transformToPeriods(limits) || [];
    },

    depositPeriods(state) {
      const limits = state.activeLimits.filter(limit => limit.definition === 3);
      return transformToPeriods(limits) || [];
    },

    selfExclusionLimits(state) {
      return state.activeLimits.filter(limit => limit.definition === 4);
    },

    coolingOffLimits(state) {
      return state.activeLimits.filter(limit => limit.definition === 5);
    },

    limitCashPeriod() {
      const { settingsConstants } = useGlobalStore();
      return settingsConstants?.player.limit.cashPeriod || [];
    },

    coolingOffPeriod() {
      const { settingsConstants, globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
      const { getContent } = useProjectMethods();
      const content = getContent(
        globalComponentsContent,
        defaultLocaleGlobalComponentsContent,
        'constants.limitPeriods'
      );

      return (
        settingsConstants?.player.limit.coolingOffPeriod.map(period => ({
          value: content?.[period.id] || '',
          code: period.id,
        })) || []
      );
    },

    selfExclusionPeriod() {
      const { settingsConstants, globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
      const { getContent } = useProjectMethods();
      const content = getContent(
        globalComponentsContent,
        defaultLocaleGlobalComponentsContent,
        'constants.limitPeriods'
      );

      return (
        settingsConstants?.player.limit.selfExclusionPeriod.map(period => ({
          value: content?.[period.id] || '',
          code: period.id,
        })) || []
      );
    },
  },
});

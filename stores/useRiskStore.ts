import type { ITurnOverWager } from '@skeleton/api/types';
import { getTurnOverWager as requestTurnOverWager } from '@skeleton/api/risk';

interface IRiskStoreState {
  turnOverWagerData: ITurnOverWager;
}

export const useRiskStore = defineStore('riskStore', {
  state: (): IRiskStoreState => ({
    turnOverWagerData: {
      total: 0,
      turnOverWager: 0,
      turnOverWagerAmount: 0,
      currency: '',
    },
  }),

  actions: {
    async getTurnOverWager(): Promise<void> {
      const { activeAccount } = useWalletStore();
      this.turnOverWagerData = await requestTurnOverWager(activeAccount?.currency as string);
    },
  },
});

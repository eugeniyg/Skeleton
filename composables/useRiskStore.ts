import {defineStore} from 'pinia';
import type {
  ITurnOverWager
} from '@skeleton/core/types';

interface IRiskStoreState {
  turnOverWagerData: ITurnOverWager,
}

export const useRiskStore = defineStore('riskStore', {
  state: ():IRiskStoreState => ({
    turnOverWagerData: {
      turnOverWager: 0,
      turnOverWagerAmount: 0,
      currency: ''
    }
  }),

  actions: {
    async getTurnOverWager():Promise<void> {
      const { getTurnOverWager } = useCoreRiskApi();
      const { activeAccount } = useWalletStore();
      this.turnOverWagerData = await getTurnOverWager(activeAccount?.currency as string);
    },
  },
});

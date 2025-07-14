import type { ITurnOverWager } from '../types';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';

export const useCoreRiskApi = () => {
  const getTurnOverWager = async (currency: string): Promise<ITurnOverWager> => {
    const { data } = await useApiAuthInstance('/api/risk/reasons/turn-over-wager', { params: { currency } });
    return data;
  };

  return {
    getTurnOverWager,
  };
};

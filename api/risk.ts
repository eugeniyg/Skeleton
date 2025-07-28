import type { ITurnOverWager } from './types';
import { apiAuthInstance } from './apiAuthInstance';

export const getTurnOverWager = async (currency: string): Promise<ITurnOverWager> => {
  const { data } = await apiAuthInstance('/api/risk/reasons/turn-over-wager', { params: { currency } });
  return data;
};

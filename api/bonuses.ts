import type {
  IBonusCode,
  IPlayerBonusesRequest,
  IPlayerBonusesResponse,
  IPlayerBonus,
  IPlayerFreeSpin,
  IPlayerFreeSpinsRequest,
  IPlayerFreeSpinsResponse,
  IPlayerCashback,
  IBonus,
  IBonusesStatus,
} from './types';

export const getPlayerBonuses = async (params?: IPlayerBonusesRequest): Promise<IPlayerBonusesResponse> => {
  return await useApiAuthInstance('/api/game/player-bonuses', { params });
};

export const getPlayerFreeSpins = async (params?: IPlayerFreeSpinsRequest): Promise<IPlayerFreeSpinsResponse> => {
  return await useApiAuthInstance('/api/game/player-freespins', { params });
};

export const activatePlayerBonus = async (playerBonusId: string): Promise<IPlayerBonus> => {
  const { data } = await useApiAuthInstance(`/api/game/player-bonuses/${playerBonusId}/activate`, { method: 'PUT' });
  return data;
};

export const activatePlayerFreeSpin = async (playerFreeSpinId: string): Promise<IPlayerFreeSpin> => {
  const { data } = await useApiAuthInstance(`/api/game/player-freespins/${playerFreeSpinId}/activate`, {
    method: 'PUT',
  });
  return data;
};

export const cancelPlayerBonus = async (playerBonusId: string): Promise<IPlayerBonus> => {
  const { data } = await useApiAuthInstance(`/api/game/player-bonuses/${playerBonusId}/cancel`, { method: 'PUT' });
  return data;
};

export const cancelPlayerFreeSpin = async (playerFreeSpinId: string): Promise<IPlayerFreeSpin> => {
  const { data } = await useApiAuthInstance(`/api/game/player-freespins/${playerFreeSpinId}/cancel`, {
    method: 'PUT',
  });
  return data;
};

export const getBonusCodes = async (trigger: number): Promise<IBonusCode[]> => {
  const { data } = await useApiAuthInstance('/api/game/bonuses/bonuscodes', { params: { trigger } });
  return data;
};

export const addBonusCode = async (bonusCode: string, trigger: number): Promise<IBonusCode> => {
  const { data } = await useApiAuthInstance('/api/game/bonuses/bonuscodes', {
    method: 'POST',
    body: { bonusCode, trigger },
  });
  return data;
};

export const deleteBonusCode = async (playerBonusCodeId: string): Promise<IBonusCode> => {
  const { data } = await useApiAuthInstance('/api/game/bonuses/bonuscodes', {
    method: 'DELETE',
    body: { playerBonusCodeId },
  });
  return data;
};

export const getPlayerCashback = async (currency?: string): Promise<{ data: IPlayerCashback[] }> => {
  return await useApiAuthInstance('/api/game/bonuses/cashback', { params: { currency } });
};

export const getDepositBonuses = async (currency: string, amount?: number): Promise<IBonus[]> => {
  const { data } = await useApiAuthInstance('/api/game/bonuses', { params: { currency, amount } });
  return data;
};

export const getBonusesStatus = async (bonusIds: string[], currency: string): Promise<IBonusesStatus[]> => {
  const { data } = await useApiAuthInstance('/api/game/bonuses/status', { params: { bonusIds, currency } });
  return data;
};

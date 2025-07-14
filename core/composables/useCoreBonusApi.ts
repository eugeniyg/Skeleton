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
} from '../types';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';

export const useCoreBonusApi = () => {
  const getPlayerBonuses = async (params?: IPlayerBonusesRequest): Promise<IPlayerBonusesResponse> => {
    return await useApiAuthInstance('/api/game/player-bonuses', { params });
  };

  const getPlayerFreeSpins = async (params?: IPlayerFreeSpinsRequest): Promise<IPlayerFreeSpinsResponse> => {
    return await useApiAuthInstance('/api/game/player-freespins', { params });
  };

  const activatePlayerBonus = async (playerBonusId: string): Promise<IPlayerBonus> => {
    const { data } = await useApiAuthInstance(`/api/game/player-bonuses/${playerBonusId}/activate`, { method: 'PUT' });
    return data;
  };

  const activatePlayerFreeSpin = async (playerFreeSpinId: string): Promise<IPlayerFreeSpin> => {
    const { data } = await useApiAuthInstance(`/api/game/player-freespins/${playerFreeSpinId}/activate`, {
      method: 'PUT',
    });
    return data;
  };

  const cancelPlayerBonus = async (playerBonusId: string): Promise<IPlayerBonus> => {
    const { data } = await useApiAuthInstance(`/api/game/player-bonuses/${playerBonusId}/cancel`, { method: 'PUT' });
    return data;
  };

  const cancelPlayerFreeSpin = async (playerFreeSpinId: string): Promise<IPlayerFreeSpin> => {
    const { data } = await useApiAuthInstance(`/api/game/player-freespins/${playerFreeSpinId}/cancel`, {
      method: 'PUT',
    });
    return data;
  };

  const getBonusCodes = async (trigger: number): Promise<IBonusCode[]> => {
    const { data } = await useApiAuthInstance('/api/game/bonuses/bonuscodes', { params: { trigger } });
    return data;
  };

  const addBonusCode = async (bonusCode: string, trigger: number): Promise<IBonusCode> => {
    const { data } = await useApiAuthInstance('/api/game/bonuses/bonuscodes', {
      method: 'POST',
      body: { bonusCode, trigger },
    });
    return data;
  };

  const deleteBonusCode = async (playerBonusCodeId: string): Promise<IBonusCode> => {
    const { data } = await useApiAuthInstance('/api/game/bonuses/bonuscodes', {
      method: 'DELETE',
      body: { playerBonusCodeId },
    });
    return data;
  };

  const getPlayerCashback = async (currency?: string): Promise<{ data: IPlayerCashback[] }> => {
    return await useApiAuthInstance('/api/game/bonuses/cashback', { params: { currency } });
  };

  const getDepositBonuses = async (currency: string, amount?: number): Promise<IBonus[]> => {
    const { data } = await useApiAuthInstance('/api/game/bonuses', { params: { currency, amount } });
    return data;
  };

  const getBonusesStatus = async (bonusIds: string[], currency: string): Promise<IBonusesStatus[]> => {
    const { data } = await useApiAuthInstance('/api/game/bonuses/status', { params: { bonusIds, currency } });
    return data;
  };

  const getBonuses = async (params?: any): Promise<IBonus[]> => {
    const { data } = await useApiAuthInstance('/api/game/bonuses', { params });
    return data;
  };

  return {
    getBonuses,
    getPlayerBonuses,
    getPlayerFreeSpins,
    activatePlayerBonus,
    activatePlayerFreeSpin,
    cancelPlayerBonus,
    cancelPlayerFreeSpin,
    getBonusCodes,
    addBonusCode,
    deleteBonusCode,
    getPlayerCashback,
    getDepositBonuses,
    getBonusesStatus,
  };
};

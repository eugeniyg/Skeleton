import { useFetchInstance } from '../assets/apiInstance';
import type {
  IBonusCode,
  IPlayerBonusesRequest,
  IPlayerBonusesResponse,
  IPlayerBonus,
  IPlayerFreeSpin,
  IPlayerFreeSpinsRequest,
  IPlayerFreeSpinsResponse,
  IPlayerCashback
} from '../types';

export const useCoreBonusApi = () => {
  const getPlayerBonuses = async (params?: IPlayerBonusesRequest):Promise<IPlayerBonusesResponse> => {
    return await useFetchInstance('/api/game/player-bonuses', { params });
  };

  const getPlayerFreeSpins = async (params?: IPlayerFreeSpinsRequest):Promise<IPlayerFreeSpinsResponse> => {
    return await useFetchInstance('/api/game/player-freespins', { params });
  };

  const activatePlayerBonus = async (playerBonusId: string):Promise<IPlayerBonus> => {
    const { data } = await useFetchInstance(`/api/game/player-bonuses/${playerBonusId}/activate`, { method: 'PUT' });
    return data;
  };

  const activatePlayerFreeSpin = async (playerFreeSpinId: string):Promise<IPlayerFreeSpin> => {
    const { data } = await useFetchInstance(`/api/game/player-freespins/${playerFreeSpinId}/activate`, { method: 'PUT' });
    return data;
  };

  const cancelPlayerBonus = async (playerBonusId: string):Promise<IPlayerBonus> => {
    const { data } = await useFetchInstance(`/api/game/player-bonuses/${playerBonusId}/cancel`, { method: 'PUT' });
    return data;
  };

  const cancelPlayerFreeSpin = async (playerFreeSpinId: string):Promise<IPlayerFreeSpin> => {
    const { data } = await useFetchInstance(`/api/game/player-freespins/${playerFreeSpinId}/cancel`, { method: 'PUT' });
    return data;
  };

  const getBonusCodes = async (trigger: number):Promise<IBonusCode[]> => {
    const { data } = await useFetchInstance('/api/game/bonuses/bonuscodes', { params: { trigger } });
    return data;
  };

  const addBonusCode = async (bonusCode: string, trigger: number):Promise<IBonusCode> => {
    const { data } = await useFetchInstance('/api/game/bonuses/bonuscodes', { method: 'POST', body: { bonusCode, trigger } });
    return data;
  };

  const deleteBonusCode = async (playerBonusCodeId: string):Promise<IBonusCode> => {
    const { data } = await useFetchInstance('/api/game/bonuses/bonuscodes', { method: 'DELETE', body: { playerBonusCodeId } });
    return data;
  };

  const getPlayerCashback = async (currency?: string):Promise<{ data: IPlayerCashback[] }> => {
    return await useFetchInstance('/api/game/bonuses/cashback', { params: { currency } });
  };

  return {
    getPlayerBonuses,
    getPlayerFreeSpins,
    activatePlayerBonus,
    activatePlayerFreeSpin,
    cancelPlayerBonus,
    cancelPlayerFreeSpin,
    getBonusCodes,
    addBonusCode,
    deleteBonusCode,
    getPlayerCashback
  };
}

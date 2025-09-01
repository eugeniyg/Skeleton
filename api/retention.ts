import type {
  ILoyaltyLevelsRequest,
  ILoyaltyLevelsResponse,
  IPlayerLoyaltyAccount,
  IAvailableQuestsRequest,
  IPlayerQuest,
  IPlayerQuestsRequest,
  IPlayerQuestsResponse,
  ITournament,
  ITournamentsRequest,
  ITournamentsResponse,
  IWheelSector,
  IWheelsRequest,
  IWheelsResponse,
  ILottery,
} from './types';
import { apiGuestInstance } from './apiGuestInstance';
import { apiAuthInstance } from './apiAuthInstance';

export const getPlayerLoyaltyAccount = async (): Promise<IPlayerLoyaltyAccount> => {
  const { data } = await apiAuthInstance('/api/retention/account');
  return data;
};

export const getLoyaltyLevels = async (params?: ILoyaltyLevelsRequest): Promise<ILoyaltyLevelsResponse> => {
  const response = await apiGuestInstance('/api/retention/levels', { params });
  return response;
};

export const getAvailableQuests = async (params?: IAvailableQuestsRequest): Promise<IPlayerQuestsResponse> => {
  return await apiAuthInstance('/api/retention/quests', { params });
};

export const getPlayerQuests = async (params?: IPlayerQuestsRequest): Promise<IPlayerQuestsResponse> => {
  return await apiAuthInstance('/api/retention/player-quests', { params });
};

export const activatePlayerQuest = async (playerQuestId: string): Promise<IPlayerQuest> => {
  const { data } = await apiAuthInstance(`/api/retention/quests/${playerQuestId}/activate`, { method: 'PUT' });
  return data;
};

export const cancelPlayerQuest = async (playerQuestId: string): Promise<IPlayerQuest> => {
  const { data } = await apiAuthInstance(`/api/retention/player-quests/${playerQuestId}/cancel`, {
    method: 'PUT',
  });
  return data;
};

export const getTournaments = async (params?: ITournamentsRequest): Promise<ITournamentsResponse> => {
  return await apiGuestInstance('/api/retention/tournaments', { params });
};

export const getTournament = async (params: { tournamentId: string; authorized: boolean }): Promise<ITournament> => {
  const { data } = params.authorized
    ? await apiAuthInstance(`/api/retention/tournaments/${params.tournamentId}`)
    : await apiGuestInstance(`/api/retention/tournaments/${params.tournamentId}`);
  return data;
};

export const participateTournament = async (tournamentId: string): Promise<void> => {
  await apiAuthInstance(`/api/retention/tournaments/${tournamentId}/participate`, {
    method: 'POST',
  });
};

export const getWheels = async (serverSide: boolean, params?: IWheelsRequest): Promise<IWheelsResponse> => {
  if (serverSide) return await apiGuestInstance('/api/retention/wheels', { params });
  return await apiAuthInstance('/api/retention/wheels', { params });
};

export const spinWheel = async (wheelId: string): Promise<IWheelSector> => {
  const { data } = await apiAuthInstance(`/api/retention/wheels/${wheelId}/spin`, {
    method: 'POST',
  });
  return data;
};

export const getLotteriesPricing = async (currency: string): Promise<ILottery[]> => {
  const { data } = await apiAuthInstance('/api/retention/lotteries/pricing', {
    params: { currency }
  });
  return data;
}
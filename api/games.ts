import type {
  IBetsResponse,
  ICollection,
  IGame,
  IGameProvider,
  IGamesRequest,
  IGamesResponse,
  IGameStart,
  IProvidersRequest,
  IRecentlyRequest,
  ISpinsResponse,
  IWinner,
  IWinnersRequest,
} from './types';
import { apiGuestInstance } from './apiGuestInstance';

export const getGameCollections = async (): Promise<ICollection[]> => {
  const { data } = await apiGuestInstance('/api/game/collections');
  return data;
};

export const getGameProviders = async (params?: IProvidersRequest): Promise<IGameProvider[]> => {
  const { data } = await apiGuestInstance('/api/game/providers', { params });
  return data;
};

export const getProviderInfo = async (combineProviderId: string): Promise<IGameProvider> => {
  const { data } = await apiGuestInstance(`/api/game/providers/${combineProviderId}`);
  return data;
};

export const getFilteredGames = async (filterParams: IGamesRequest): Promise<IGamesResponse> => {
  return await useApiAuthInstance('/api/game/games', { params: filterParams });
};

export const getGamesInfo = async (gameId: string): Promise<IGame> => {
  const { data } = await apiGuestInstance(`/api/game/games/${gameId}`);
  return data;
};

export const getStartGame = async (gameId: string, requestData: IGameStart): Promise<{ gameUrl: string; token: string }> => {
  const { data } = await useApiAuthInstance(`/api/game/games/${gameId}/play`, { method: 'POST', body: requestData });
  return data;
};

export const getFavorite = async (): Promise<IGame[]> => {
  const { data } = await useApiAuthInstance('/api/game/games/favorites');
  return data;
};

export const setFavorite = async (gameId: string): Promise<IGame[]> => {
  const { data } = await useApiAuthInstance(`/api/game/games/${gameId}/favorite`, { method: 'POST' });
  return data;
};

export const deleteFavorite = async (gameId: string): Promise<IGame[]> => {
  const { data } = await useApiAuthInstance(`/api/game/games/${gameId}/favorite`, { method: 'DELETE' });
  return data;
};

export const getSpinsHistory = async (page?: number, perPage?: number): Promise<ISpinsResponse> => {
  return await useApiAuthInstance('/api/game/spins', { params: { page, perPage } });
};

export const getBetsHistory = async (page?: number, perPage?: number, isSettled = true): Promise<IBetsResponse> => {
  return await useApiAuthInstance('/api/game/bets', {
    params: { page, perPage, isSettled },
  });
};

export const getLatestWinners = async (requestData: IWinnersRequest): Promise<IWinner[]> => {
  const { data } = await apiGuestInstance('/api/game/spins/winners', { params: requestData });
  return data;
};

export const getRecentlyPlayed = async (requestData: IRecentlyRequest): Promise<IGame[]> => {
  const { data } = await useApiAuthInstance('/api/game/games/played', { params: requestData });
  return data;
};
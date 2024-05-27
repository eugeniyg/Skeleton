import type {
  IBetsResponse,
  ICollection,
  IGame,
  IGameProvider,
  IGamesRequest,
  IGamesResponse,
  IGameStart, IProvidersRequest,
  IRecentlyRequest,
  ISpinsResponse,
  IWinner,
  IWinnersRequest
} from '../types';
import { useApiGuestInstance } from "@skeleton/core/assets/apiGuestInstance";
import { useApiAuthInstance } from "@skeleton/core/assets/apiAuthInstance";

export const useCoreGamesApi = () => {
  const getGameCollections = async ():Promise<ICollection[]> => {
    const { data } = await useApiGuestInstance('/api/game/collections');
    return data;
  };

  const getGameProviders = async (params?: IProvidersRequest):Promise<IGameProvider[]> => {
    const { data } = await useApiGuestInstance('/api/game/providers', { params });
    return data;
  };

  const getProviderInfo = async (combineProviderId: string): Promise<IGameProvider> => {
    const { data } = await useApiGuestInstance(`/api/game/providers/${combineProviderId}`);
    return data;
  }

  const getFilteredGames = async (filterParams: IGamesRequest):Promise<IGamesResponse> => {
    return await useApiAuthInstance('/api/game/games', {params: filterParams});
  };

  const getGamesInfo = async (gameId: string):Promise<IGame> => {
    const { data } = await useApiGuestInstance(`/api/game/games/${gameId}`);
    return data;
  };

  const getStartGame = async (gameId: string, requestData: IGameStart):Promise<{gameUrl: string, token: string }> => {
    const { data } = await useApiAuthInstance(`/api/game/games/${gameId}/play`, { method: 'POST', body: requestData });
    return data;
  };

  const getFavorite = async ():Promise<IGame[]> => {
    const { data } = await useApiAuthInstance('/api/game/games/favorites');
    return data;
  };

  const setFavorite = async (gameId: string):Promise<IGame[]> => {
    const { data } = await useApiAuthInstance(`/api/game/games/${gameId}/favorite`, { method: 'POST' });
    return data;
  };

  const deleteFavorite = async (gameId: string):Promise<IGame[]> => {
    const { data } = await useApiAuthInstance(`/api/game/games/${gameId}/favorite`, { method: 'DELETE' });
    return data;
  };

  const getSpinsHistory = async (page?: number, perPage?: number):Promise<ISpinsResponse> => {
    return await useApiAuthInstance('/api/game/spins', {params: {page, perPage}});
  };

  const getBetsHistory = async (page?: number, perPage?: number, isSettled = true):Promise<IBetsResponse> => {
    return await useApiAuthInstance('/api/game/bets', {
      params: {page, perPage, isSettled}
    });
  };

  const getLatestWinners = async (requestData: IWinnersRequest):Promise<IWinner[]> => {
    const { data } = await useApiGuestInstance('/api/game/spins/winners', { params: requestData });
    return data;
  };

  const getRecentlyPlayed = async (requestData: IRecentlyRequest):Promise<IGame[]> => {
    const { data } = await useApiAuthInstance('/api/game/games/played', { params: requestData });
    return data;
  };

  return {
    getGameCollections,
    getGameProviders,
    getProviderInfo,
    getFilteredGames,
    getGamesInfo,
    getStartGame,
    getFavorite,
    setFavorite,
    deleteFavorite,
    getSpinsHistory,
    getBetsHistory,
    getLatestWinners,
    getRecentlyPlayed
  };
}

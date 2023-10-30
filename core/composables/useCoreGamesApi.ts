import {
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
import {useFetchInstance} from '../assets/apiInstance';
import {getCacheData, setCacheData} from '../assets/coreCache';

export const useCoreGamesApi = () => {
  const getGameCollections = async ():Promise<ICollection[]> => {
    const cacheGameCollections = getCacheData('collections');
    if (cacheGameCollections) {
      return cacheGameCollections;
    }

    const { data } = await useFetchInstance('/api/game/collections');
    setCacheData('collections', data);
    return data;
  };

  const getGameProviders = async (params?: IProvidersRequest):Promise<IGameProvider[]> => {
    const cacheGameProviders = getCacheData('providers');
    if (!params && cacheGameProviders) {
      return cacheGameProviders;
    }

    const { data } = await useFetchInstance('/api/game/providers', { params });
    if (!params) setCacheData('providers', data);
    return data;
  };

  const getProviderInfo = async (combineProviderId: string): Promise<IGameProvider> => {
    const { data } = await useFetchInstance(`/api/game/providers/${combineProviderId}`);
    return data;
  }

  const getFilteredGames = async (filterParams: IGamesRequest):Promise<IGamesResponse> => {
    return await useFetchInstance('/api/game/games', {params: filterParams});
  };

  const getGamesInfo = async (gameId: string):Promise<IGame> => {
    const { data } = await useFetchInstance(`/api/game/games/${gameId}`);
    return data;
  };

  const getStartGame = async (gameId: string, requestData: IGameStart):Promise<{gameUrl: string, token: string }> => {
    const { data } = await useFetchInstance(`/api/game/games/${gameId}/play`, { method: 'POST', body: requestData });
    return data;
  };

  const getFavorite = async ():Promise<IGame[]> => {
    const { data } = await useFetchInstance('/api/game/games/favorites');
    return data;
  };

  const setFavorite = async (gameId: string):Promise<IGame[]> => {
    const { data } = await useFetchInstance(`/api/game/games/${gameId}/favorite`, { method: 'POST' });
    return data;
  };

  const deleteFavorite = async (gameId: string):Promise<IGame[]> => {
    const { data } = await useFetchInstance(`/api/game/games/${gameId}/favorite`, { method: 'DELETE' });
    return data;
  };

  const getSpinsHistory = async (page?: number, perPage?: number):Promise<ISpinsResponse> => {
    return await useFetchInstance('/api/game/spins', {params: {page, perPage}});
  };

  const getBetsHistory = async (page?: number, perPage?: number, isSettled = true):Promise<IBetsResponse> => {
    return await useFetchInstance('/api/game/bets', {
      params: {page, perPage, isSettled}
    });
  };

  const getLatestWinners = async (requestData: IWinnersRequest):Promise<IWinner[]> => {
    const { data } = await useFetchInstance('/api/game/spins/winners', { params: requestData });
    return data;
  };

  const getRecentlyPlayed = async (requestData: IRecentlyRequest):Promise<IGame[]> => {
    const { data } = await useFetchInstance('/api/game/games/played', { params: requestData });
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

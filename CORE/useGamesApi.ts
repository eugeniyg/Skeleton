import { useFetchInstance } from './apiInstance';
import {
  CollectionInterface, GameInterface, GameProviderInterface, GamesResponseInterface, GameStartInterface,
} from './types';

const useGamesApi = () => {
  const getGameCollections = async ():Promise<CollectionInterface[]> => {
    const { data } = await useFetchInstance('/api/game/collections');
    return data;
  };

  const getGameProviders = async ():Promise<GameProviderInterface[]> => {
    const { data } = await useFetchInstance('/api/game/providers');
    return data;
  };

  const getFilteredGames = async (filterParams: any):Promise<GamesResponseInterface> => {
    const data = await useFetchInstance('/api/game/games', { params: filterParams });
    return data;
  };

  const getGamesInfo = async (gameId: string):Promise<GameInterface> => {
    const { data } = await useFetchInstance(`/api/game/games/${gameId}`);
    return data;
  };

  const getStartGame = async (gameId: string, requestData: GameStartInterface):Promise<{gameUrl: string}> => {
    const { data } = await useFetchInstance(`/api/game/games/${gameId}/play`, { method: 'POST', body: requestData });
    return data;
  };

  const getFavorite = async ():Promise<GameInterface[]> => {
    const { data } = await useFetchInstance('/api/game/games/favorite');
    return data;
  };

  const setFavorite = async (gameId: string):Promise<GameInterface[]> => {
    const { data } = await useFetchInstance('/api/game/games/favorite', { method: 'POST', body: { gameId } });
    return data;
  };

  const deleteFavorite = async (gameId: string):Promise<GameInterface[]> => {
    const { data } = await useFetchInstance('/api/game/games/favorite', { method: 'DELETE', body: { gameId } });
    return data;
  };

  return {
    getGameCollections,
    getGameProviders,
    getFilteredGames,
    getGamesInfo,
    getStartGame,
    getFavorite,
    setFavorite,
    deleteFavorite,
  };
};

export { useGamesApi };

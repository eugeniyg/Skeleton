import { useFetchInstance } from './apiInstance';

const useGamesApi = () => {
  const getGameCollections = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/game/collections');
    return data;
  };

  const getGameProviders = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/game/providers');
    return data;
  };

  const getFilteredGames = async (filterParams: any):Promise<any> => {
    const data = await useFetchInstance('/api/game/games', { params: filterParams });
    return data;
  };

  const getGamesInfo = async (gameId: any):Promise<any> => {
    const { data } = await useFetchInstance(`/api/game/games/${gameId}`);
    return data;
  };

  const getStartGame = async (gameId: any, requestData: any):Promise<any> => {
    const { data } = await useFetchInstance(`/api/game/games/${gameId}/play`, { method: 'POST', body: requestData });
    return data;
  };

  const getFavorite = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/game/games/favorite');
    return data;
  };

  const setFavorite = async (gameId: string):Promise<any> => {
    const { data } = await useFetchInstance('/api/game/games/favorite', { method: 'POST', body: { gameId } });
    return data;
  };

  const deleteFavorite = async (gameId: string):Promise<any> => {
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

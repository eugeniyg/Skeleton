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

  return {
    getGameCollections,
    getGameProviders,
    getFilteredGames,
    getGamesInfo,
    getStartGame,
  };
};

export { useGamesApi };

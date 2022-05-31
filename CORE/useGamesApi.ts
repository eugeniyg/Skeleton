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

  return {
    getGameCollections,
    getGameProviders,
    getFilteredGames,
  };
};

export { useGamesApi };

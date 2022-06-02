import { useFetchInstance } from './apiInstance';

const useWalletApi = () => {
  const getGameCollections = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/game/collections');
    return data;
  };

  return {
    getGameCollections,
  };
};

export { useWalletApi };

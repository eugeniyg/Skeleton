import { useFetchInstance } from './apiInstance';

const useWalletApi = () => {
  const getAccounts = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/wallet/accounts');
    return data;
  };

  return {
    getAccounts,
  };
};

export { useWalletApi };

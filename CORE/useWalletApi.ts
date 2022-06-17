import { useFetchInstance } from './apiInstance';

const useWalletApi = () => {
  const getAccounts = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/wallet/accounts');
    return data;
  };

  const addAccount = async (currency:{ currency: string }):Promise<any> => {
    const { data } = await useFetchInstance('/api/wallet/accounts', {
      method: 'POST',
      body: currency,
    });
    return data;
  };

  const switchActiveAccount = async (switchData: any):Promise<any> => {
    const { data } = await useFetchInstance('/api/wallet/accounts/switch', {
      method: 'POST',
      body: switchData,
    });
    return data;
  };

  const hideWalletAccount = async (hideData: any):Promise<any> => {
    const { data } = await useFetchInstance('/api/wallet/accounts/hide', {
      method: 'POST',
      body: hideData,
    });
    return data;
  };

  const getDepositMethods = async (accountId: string, currency: string):Promise<any> => {
    const { data } = await useFetchInstance(`/api/payment/methods/deposit?accountId=${accountId}&currency=${currency}`);
    return data;
  };

  const depositAccount = async (depositData):Promise<any> => {
    const { data } = await useFetchInstance('/api/payment/invoices/deposit', {
      method: 'POST',
      body: depositData,
    });
    return data;
  };

  return {
    getAccounts,
    addAccount,
    switchActiveAccount,
    hideWalletAccount,
    getDepositMethods,
    depositAccount,
  };
};

export { useWalletApi };

import type {
  IAccount,
  IInvoice,
  IInvoicesRequestOptions,
  IPaymentMethod,
  IRequestDeposit,
  IRequestWithdraw,
  IResponseDeposit,
  IResponseInvoices,
  IResponseWithdraw
} from '../types';
import {useFetchInstance} from '../assets/apiInstance';

export const useCoreWalletApi = () => {
  const getAccounts = async ():Promise<IAccount[]> => {
    const { data } = await useFetchInstance('/api/wallet/accounts');
    return data;
  };

  const addAccount = async (currency: string):Promise<IAccount[]> => {
    const { data } = await useFetchInstance('/api/wallet/accounts', {
      method: 'POST',
      body: { currency }
    });
    return data;
  };

  const switchActiveAccount = async (accountId: string):Promise<IAccount[]> => {
    const { data } = await useFetchInstance(`/api/wallet/accounts/${accountId}/switch`, { method: 'PUT' });
    return data;
  };

  const hideWalletAccount = async (accountId: string):Promise<IAccount[]> => {
    const { data } = await useFetchInstance(`/api/wallet/accounts/${accountId}/hide`, { method: 'PUT' });
    return data;
  };

  const getDepositMethods = async (currency: string):Promise<IPaymentMethod[]> => {
    const { data } = await useFetchInstance('/api/payment/methods/deposit', { params: { currency } });
    return data;
  };

  const getWithdrawMethods = async (currency: string):Promise<IPaymentMethod[]> => {
    const { data } = await useFetchInstance('/api/payment/methods/withdrawal', { params: { currency } });
    return data;
  };

  const depositAccount = async (depositData: IRequestDeposit):Promise<IResponseDeposit> => {
    const { data } = await useFetchInstance('/api/payment/invoices/deposit', {
      method: 'POST',
      body: depositData
    });
    return data;
  };

  const withdrawAccount = async (withdrawData: IRequestWithdraw):Promise<IResponseWithdraw> => {
    const { data } = await useFetchInstance('/api/payment/invoices/withdrawal', {
      method: 'POST',
      body: withdrawData
    });
    return data;
  };

  const getPlayerInvoices = async (requestOptions: IInvoicesRequestOptions):Promise<IResponseInvoices> => {
    return await useFetchInstance('/api/payment/invoices', {params: requestOptions});
  };

  const cancelInvoice = async (invoiceId: string):Promise<IInvoice> => {
    const { data } = await useFetchInstance(`/api/payment/invoices/${invoiceId}/decline`, { method: 'PUT' });
    return data;
  };

  return {
    getAccounts,
    addAccount,
    switchActiveAccount,
    hideWalletAccount,
    getDepositMethods,
    depositAccount,
    getWithdrawMethods,
    withdrawAccount,
    getPlayerInvoices,
    cancelInvoice
  };
}

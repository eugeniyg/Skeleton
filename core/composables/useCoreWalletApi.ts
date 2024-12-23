import type {
  IAccount,
  IInvoice,
  IInvoicesRequestOptions,
  IPaymentMethod,
  IRequestDeposit,
  IRequestWithdraw,
  IResponseDeposit,
  IResponseInvoices,
  IResponseWithdraw,
  IInvoiceStatistics,
} from '../types';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';

export const useCoreWalletApi = () => {
  const getAccounts = async (): Promise<IAccount[]> => {
    const { data } = await useApiAuthInstance('/api/wallet/accounts');
    return data;
  };

  const addAccount = async (currency: string): Promise<IAccount[]> => {
    const { data } = await useApiAuthInstance('/api/wallet/accounts', {
      method: 'POST',
      body: { currency },
    });
    return data;
  };

  const switchActiveAccount = async (accountId: string): Promise<IAccount[]> => {
    const { data } = await useApiAuthInstance(`/api/wallet/accounts/${accountId}/switch`, { method: 'PUT' });
    return data;
  };

  const hideWalletAccount = async (accountId: string): Promise<IAccount[]> => {
    const { data } = await useApiAuthInstance(`/api/wallet/accounts/${accountId}/hide`, { method: 'PUT' });
    return data;
  };

  const getDepositMethods = async (currency: string, country: Maybe<string>): Promise<IPaymentMethod[]> => {
    const { data } = await useApiAuthInstance('/api/payment/methods/deposit', { params: { currency, country } });
    return data;
  };

  const getWithdrawMethods = async (currency: string, country: Maybe<string>): Promise<IPaymentMethod[]> => {
    const { data } = await useApiAuthInstance('/api/payment/methods/withdrawal', { params: { currency, country } });
    return data;
  };

  const depositAccount = async (depositData: IRequestDeposit): Promise<IResponseDeposit> => {
    const { data } = await useApiAuthInstance('/api/payment/invoices/deposit', {
      method: 'POST',
      body: depositData,
    });
    return data;
  };

  const withdrawAccount = async (withdrawData: IRequestWithdraw): Promise<IResponseWithdraw> => {
    const { data } = await useApiAuthInstance('/api/payment/invoices/withdrawal', {
      method: 'POST',
      body: withdrawData,
    });
    return data;
  };

  const getPlayerInvoices = async (requestOptions: IInvoicesRequestOptions): Promise<IResponseInvoices> => {
    return await useApiAuthInstance('/api/payment/invoices', { params: requestOptions });
  };

  const cancelInvoice = async (invoiceId: string): Promise<IInvoice> => {
    const { data } = await useApiAuthInstance(`/api/payment/invoices/${invoiceId}/decline`, { method: 'PUT' });
    return data;
  };

  const getInvoicesStatistics = async (): Promise<IInvoiceStatistics[]> => {
    const { data } = await useApiAuthInstance('/api/payment/invoices/statistics');
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
    cancelInvoice,
    getInvoicesStatistics,
  };
};

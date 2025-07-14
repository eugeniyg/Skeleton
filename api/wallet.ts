import type {
  IAccount,
  IInvoice,
  IInvoicesRequestOptions,
  IPaymentMethod,
  IRequestDeposit,
  IRequestWithdraw,
  IResponseDeposit,
  IResponseInvoices,
  IInvoiceStatistics,
  IWithdrawResponse,
} from './types';
import { apiAuthInstance } from './apiAuthInstance';

export const getAccounts = async (): Promise<IAccount[]> => {
  const { data } = await apiAuthInstance('/api/wallet/accounts');
  return data;
};

export const addAccount = async (currency: string): Promise<IAccount[]> => {
  const { data } = await apiAuthInstance('/api/wallet/accounts', {
    method: 'POST',
    body: { currency },
  });
  return data;
};

export const switchActiveAccount = async (accountId: string): Promise<IAccount[]> => {
  const { data } = await apiAuthInstance(`/api/wallet/accounts/${accountId}/switch`, { method: 'PUT' });
  return data;
};

export const hideWalletAccount = async (accountId: string): Promise<IAccount[]> => {
  const { data } = await apiAuthInstance(`/api/wallet/accounts/${accountId}/hide`, { method: 'PUT' });
  return data;
};

export const getDepositMethods = async (currency: string, country: Maybe<string>): Promise<IPaymentMethod[]> => {
  const { data } = await apiAuthInstance('/api/payment/methods/deposit', { params: { currency, country } });
  return data;
};

export const getWithdrawMethods = async (currency: string, country: Maybe<string>): Promise<IPaymentMethod[]> => {
  const { data } = await apiAuthInstance('/api/payment/methods/withdrawal', { params: { currency, country } });
  return data;
};

export const depositAccount = async (depositData: IRequestDeposit): Promise<IResponseDeposit> => {
  const { data } = await apiAuthInstance('/api/payment/invoices/deposit', {
    method: 'POST',
    body: depositData,
  });
  return data;
};

export const withdrawAccount = async (withdrawData: IRequestWithdraw): Promise<IWithdrawResponse> => {
  const { data } = await apiAuthInstance('/api/payment/invoices/withdrawal', {
    method: 'POST',
    body: withdrawData,
  });
  return data;
};

export const getPlayerInvoices = async (requestOptions: IInvoicesRequestOptions): Promise<IResponseInvoices> => {
  return await apiAuthInstance('/api/payment/invoices', { params: requestOptions });
};

export const cancelInvoice = async (invoiceId: string): Promise<IInvoice> => {
  const { data } = await apiAuthInstance(`/api/payment/invoices/${invoiceId}/decline`, { method: 'PUT' });
  return data;
};

export const getInvoicesStatistics = async (): Promise<IInvoiceStatistics[]> => {
  const { data } = await apiAuthInstance('/api/payment/invoices/statistics');
  return data;
};

import { useFetchInstance } from './apiInstance';
import {
  AccountInterface,
  AccountRequestInterface, InvoiceInterface, InvoicesRequestOptionsInterface,
  PaymentMethodInterface,
  RequestDepositInterface,
  RequestWithdrawInterface,
  ResponseDepositInterface, ResponseInvoicesInterface,
  ResponseWithdrawInterface, SessionInterface,
} from './types';

const useWalletApi = () => {
  const getAccounts = async ():Promise<AccountInterface[]> => {
    const { data } = await useFetchInstance('/api/wallet/accounts');
    return data;
  };

  const addAccount = async (currency:{ currency: string }):Promise<AccountInterface[]> => {
    const { data } = await useFetchInstance('/api/wallet/accounts', {
      method: 'POST',
      body: currency,
    });
    return data;
  };

  const switchActiveAccount = async (switchData: AccountRequestInterface):Promise<AccountInterface[]> => {
    const { data } = await useFetchInstance('/api/wallet/accounts/switch', {
      method: 'POST',
      body: switchData,
    });
    return data;
  };

  const hideWalletAccount = async (hideData: AccountRequestInterface):Promise<AccountInterface[]> => {
    const { data } = await useFetchInstance('/api/wallet/accounts/hide', {
      method: 'POST',
      body: hideData,
    });
    return data;
  };

  const getDepositMethods = async (methodsData: AccountRequestInterface):Promise<PaymentMethodInterface[]> => {
    const { data } = await useFetchInstance(`/api/payment/methods/deposit?accountId=${methodsData.accountId}&currency=${methodsData.currency}`);
    return data;
  };

  const getWithdrawMethods = async (methodsData: AccountRequestInterface):Promise<PaymentMethodInterface[]> => {
    const { data } = await useFetchInstance(`/api/payment/methods/withdrawal?accountId=${methodsData.accountId}&currency=${methodsData.currency}`);
    return data;
  };

  const depositAccount = async (depositData: RequestDepositInterface):Promise<ResponseDepositInterface> => {
    const { data } = await useFetchInstance('/api/payment/invoices/deposit', {
      method: 'POST',
      body: depositData,
    });
    return data;
  };

  const withdrawAccount = async (depositData: RequestWithdrawInterface):Promise<ResponseWithdrawInterface> => {
    const { data } = await useFetchInstance('/api/payment/invoices/withdrawal', {
      method: 'POST',
      body: depositData,
    });
    return data;
  };

  const getPlayerInvoices = async (requestOptions: InvoicesRequestOptionsInterface):Promise<ResponseInvoicesInterface> => {
    const invoicesResponse = await useFetchInstance('/api/payment/invoices', { params: requestOptions });
    return invoicesResponse;
  };

  const cancelInvoice = async (invoiceId: string):Promise<InvoiceInterface> => {
    const { data } = await useFetchInstance(`/api/payment/invoices/${invoiceId}/decline`, { method: 'POST' });
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
  };
};

export { useWalletApi };

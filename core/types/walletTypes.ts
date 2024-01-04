import type { IPaginationMeta } from './globalTypes'

export interface IAccount extends Record<string, any>{
  id: string;
  balance: number;
  realBalance: number;
  bonusBalance: number;
  lockedBalance: number;
  currency: string;
  status: number;
  withdrawalBalance: number;
}

export interface IPaymentFieldOption extends Record<string, any> {
  id: string;
  name: string;
  maxAmount: number;
  minAmount: number;
  regex?: string;
}
export interface IPaymentField extends Record<string, any> {
  key: string;
  fieldType: string;
  type: string;
  regexp: string
  labels: any[];
  hints: any[];
  isRequired: boolean;
  position: number;
  options?: IPaymentFieldOption[];
}

export interface IPaymentMethod extends Record<string, any>{
  method: string;
  amountMin: number;
  amountMax: number;
  names: any;
  logo: string;
  icon: string;
  fields: IPaymentField[];
}

export interface IRequestDeposit extends Record<string, any>{
  method: string;
  fields?: { [key:string]: string|undefined|null };
  currency: string;
  amount: number;
  accountId: string;
  redirectSuccessUrl: string;
  redirectErrorUrl: string;
  bonusId?: string;
}

export interface IRequestWithdraw extends Record<string, any>{
  method: string;
  fields?: { [key:string]: string; };
  currency: string;
  amount: number;
  accountId: string;
}

export interface IResponseDeposit extends Record<string, any>{
  action: string;
  method: string;
  fields: any[];
}

export interface IResponseWithdraw extends Record<string, any>{
  method: string;
  fields: any[];
  currency: string;
  amount: number;
  accountId: string;
}

export interface IInvoicePublicData extends Record<string, any> {
  clientId: string;
  securityCode: string;
}

export interface IInvoice extends Record<string, any>{
  id: string;
  amount: number;
  currency: string;
  status: number;
  statusResult: string;
  paymentProvider: string;
  invoiceType: number;
  createdAt: string;
  updatedAt: string|null;
  publicData: IInvoicePublicData|null;
}

export interface IResponseInvoices extends Record<string, any>{
  data: IInvoice[];
  meta: IPaginationMeta;
}

export interface IInvoicesRequestOptions extends Record<string, any>{
  page: number;
  perPage: number;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  currency?: string;
  status?: string;
}

export interface ISocketInvoice extends Record<string, any>{
  id: string;
  playerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: number;
  createdAt: string;
}

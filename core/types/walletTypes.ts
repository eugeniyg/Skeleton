import type { IPaginationMeta } from './globalTypes';

export interface IAccount extends Record<string, any> {
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
  regexp: string;
  labels: any;
  hints: any;
  isRequired: boolean;
  position: number;
  value: string | null;
  options?: IPaymentFieldOption[];
}

export interface IPaymentPreset extends Record<string, any> {
  amount: number;
  default: boolean;
}

export interface IPaymentMethod extends Record<string, any> {
  method: string;
  amountMin: number;
  amountMax: number;
  names: any;
  logo: string;
  icon: string;
  presets: IPaymentPreset[];
  fields: IPaymentField[];
  type: string;
  processingType: string;
}

export interface IRequestDeposit extends Record<string, any> {
  method: string;
  fields?: { [key: string]: string | undefined | null };
  currency: string;
  amount: number;
  accountId: string;
  redirectSuccessUrl?: string;
  redirectErrorUrl?: string;
  bonusId?: string;
  isBonusDecline: boolean;
  country: Maybe<string>;
}

export interface IRequestWithdraw extends Record<string, any> {
  method: string;
  fields?: { [key: string]: string | null | undefined };
  currency: string;
  amount: number;
  accountId: string;
  country: Maybe<string>;
}

export interface IResponseDeposit extends Record<string, any> {
  action: string;
  method: string;
  invoiceId: string;
  fields: { [key: string]: string };
  type: string;
  qr?: string;
}

export interface IWithdrawResponse {
  invoiceId: string;
  message?: string;
  action?: string;
  fields?: { [key: string]: string };
  method?: string;
  qr?: string | null;
  type?: string;
}

export interface IInvoicePublicData extends Record<string, any> {
  clientId: string;
  securityCode: string;
  agentNumber: string;
  transactionId: string;
}

export interface IInvoice extends Record<string, any> {
  id: string;
  amount: number;
  transactionAmount: number;
  currency: string;
  transactionCurrency: string;
  status: number;
  statusResult: string;
  paymentMethod: string;
  invoiceType: number;
  createdAt: string;
  updatedAt: string | null;
  publicData: IInvoicePublicData | null;
}

export interface IResponseInvoices extends Record<string, any> {
  data: IInvoice[];
  meta: IPaginationMeta;
}

export interface IInvoicesRequestOptions extends Record<string, any> {
  page: number;
  perPage: number;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  currency?: string;
  status?: string;
}

export interface ISocketInvoice extends Record<string, any> {
  id: string;
  playerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: number;
  createdAt: string;
  number: number | null;
  publicData: {
    qr: string;
    url: string;
  } | null;
}

export interface IInvoiceStatistics extends Record<string, any> {
  depositsCount: number;
  withdrawalsCount: string;
  purchasesCount: number;
  virtualPayoutsCount: number;
  withdrawalsSum: number | null;
  depositsSum: number | null;
  purchasesSum: number | null;
  virtualPayoutsSum: number | null;
  lastDepositAmount: number | null;
  lastWithdrawalAmount: number | null;
  lastPurchaseAmount: number | null;
  lastVirtualPayoutAmount: number | null;
  lastDepositProcessedAt: string | null;
  lastWithdrawalProcessedAt: string | null;
  lastPurchaseProcessedAt: string | null;
  lastVirtualPayoutProcessedAt: string | null;
  depositsSumBaseCurrency: number | null;
  withdrawalsSumBaseCurrency: number | null;
  purchasesSumBaseCurrency: number | null;
  virtualPayoutsSumBaseCurrency: number | null;
  lastDepositAmountBaseCurrency: number | null;
  lastWithdrawalAmountBaseCurrency: number | null;
  lastPurchaseAmountBaseCurrency: number | null;
  lastVirtualPayoutAmountBaseCurrency: number | null;
  currency: string;
}

import type { RegistrationType } from '@skeleton/core/types';

export interface IBrowserLanguage {
  code: string;
  script: null | string;
  region: undefined | string;
  quality: number;
}

export interface IPhoneCode {
  countryCode: string;
  code: string;
  mask?: string;
  value?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analyticsEventsArr = [
  //-- REGISTRATION EVENTS --//
  'registrationOpen',
  'registrationChangeType',
  'registrationSuccess',
  'registrationSubmit',
  'registrationOtp',
  //-- WALLET EVENTS --//
  'walletOpen',
  'walletChangeNetwork',
  'walletChangeType',
  'walletSelectBonus',
  'walletDeclineBonuses',
  'walletChangeMethod',
  'walletSubmitForm',
  'walletDepositSuccess',
  'walletWithdrawSuccess',
  'walletDepositFail',
  'walletWithdrawFail',
  'walletClose',
  'walletPromoOpen',
  'walletPromoSubmit',
  //-- BALANCE EVENTS --//
  'openBalancePopup',
] as const;
type AnalyticEvent = (typeof analyticsEventsArr)[number];

export interface IAnalyticsEvent {
  event: AnalyticEvent;
  loadTime?: number;
  regType?: RegistrationType;
  walletOperationType?: 'deposit' | 'withdraw';
  depositAmount?: number;
  withdrawAmount?: number;
  depositCurrency?: string;
  withdrawCurrency?: string;
  successDepositNumber?: number | null;
  walletType?: string;
  invoiceId?: string;
}

export interface IModalSettings {
  component: string;
  content?: string;
  queryName?: string;
  onlyGuest?: boolean;
  onlyLogged?: boolean;
}

import type { RegistrationType } from "@skeleton/core/types";

const registrationEvents = [
  'registrationOpen',
  'registrationChangeType',
  'registrationSuccess',
  'registrationSubmit',
  'registrationOtp'
] as const;

type RegistrationEvent = typeof registrationEvents[number];

export interface IRegistrationEvent {
  event: RegistrationEvent;
  loadTime?: number;
  regType?: RegistrationType;
}

const balanceEvents = [
  'openBalancePopup'
] as const;
type BalanceEvent = typeof balanceEvents[number];

export interface IBalanceEvent {
  event: BalanceEvent;
}

const walletEvents = [
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
  'walletPromoSubmit'
] as const;
type WalletEvent = typeof walletEvents[number];

export interface IWalletEvent {
  event: WalletEvent;
  loadTime?: number;
  operationType?: 'deposit'| 'withdraw';
  depositAmount?: number;
  withdrawAmount?: number;
  walletType?: string;
}

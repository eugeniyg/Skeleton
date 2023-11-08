import type { IPaginationMeta } from './globalTypes'

export interface IPlayerBonus extends Record<string, any>{
  id: string;
  playerId: string;
  name: string;
  activationExpiredAt: string|null;
  amount: number;
  bonusType: number;
  currency: string;
  currentWagerPercentage: number;
  currentWagerCasinoAmount: number;
  currentWagerSportsbookAmount: number;
  currentWagerAmount: number;
  wagerCasino: number;
  wagerSportsbook: number;
  wageringExpiredAt: string|null;
  status: number;
  result: number;
  createdAt: string;
  finishedAt: string|null;
}

export interface IPlayerFreeSpin extends Record<string, any>{
  id: string;
  name: string;
  status: number;
  result: number;
  count: number;
  usedCount: number;
  progress: number;
  gameId: string;
  activationExpiredAt: string|null;
  wageringExpiredAt: string|null;
  issuedAt: string;
  expiredAt: string|null;
  createdAt: string;
}

export interface IBonusCode extends Record<string, any>{
  id: string;
  playerId: string;
  bonusCode: string;
  trigger: number;
  status: number;
  result: number;
  createdAt: string;
}

export interface IPlayerBonusesRequest extends Record<string, any>{
  status?: number[];
  sortOrder?: 'asc'|'desc';
  page?: number;
  perPage?: number;
}

export interface IPlayerFreeSpinsRequest extends Record<string, any>{
  status?: number[];
  sortOrder?: 'asc'|'desc';
  page?: number;
  perPage?: number;
}

export interface IPlayerBonusesResponse {
  data: IPlayerBonus[];
  meta: IPaginationMeta;
}

export interface IPlayerFreeSpinsResponse {
  data: IPlayerFreeSpin[];
  meta: IPaginationMeta;
}

export interface IPlayerCashback {
  bonusId: string;
  bonusName: string;
  amount: number;
  date: string;
}

export interface IAmountRangeItem {
  amountFrom?: number;
  amountTo?: number;
  currency: string;
}

export interface IBonusAssignConditions {
  amountItems?: {
    amount: number;
    currency: string;
  }[];
  baseCurrencyAmount?: number;
  countFreespins?: number;
  gameId?: string;
  providerId?: string;
  depositPercentage?: number;
  baseCurrencyMaxAmount?: number;
  maxAmountItems?: {
    amount: number;
    currency: string;
  }[];
}

export interface IBonusTriggerConditions {
  baseCurrencyInvoiceAmountFrom: number|null;
  baseCurrencyInvoiceAmountTo: number|null;
  invoiceAmountItems: IAmountRangeItem[];
}

export interface IBonusWagerCasinoConditions {
  baseCurrencyAmountFrom: number|null;
  baseCurrencyAmountTo: number|null;
  amountItems: IAmountRangeItem[];
  gameIds: string[];
  gameIdsExcluded: boolean;
  providerIds: string[];
  providerIdsExcluded: boolean;
}

export interface IBonusWagerSportsbookConditions {
  baseCurrencyAmountFrom: number|null;
  baseCurrencyAmountTo: number|null;
  amountItems: IAmountRangeItem[];
}

export interface IBonus {
  id: string;
  name: string;
  status: number;
  type: number;
  wagerCasino: number;
  wagerSportsbook: number;
  baseCurrencyMaxWinAmount: number|null;
  maxWinAmountItems: {
    amount: number;
    currency: string;
  }[];
  assignConditions: IBonusAssignConditions;
  triggerConditions: IBonusTriggerConditions;
  wagerCasinoConditions: IBonusWagerCasinoConditions;
  wagerSportsbookConditions: IBonusWagerSportsbookConditions;
  minDeposit?: {
    amount: number;
    currency: string;
  };
  maxDeposit?: {
    amount: number;
    currency: string;
  };
}

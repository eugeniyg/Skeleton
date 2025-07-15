import type { IPaginationMeta } from './globalTypes';

export interface IPlayerBonus extends Record<string, any> {
  id: string;
  playerId: string;
  name: string;
  activationExpiredAt: string | null;
  amount: number;
  bonusType: number;
  currency: string;
  currentWagerPercentage: number;
  currentWagerCasinoAmount: number;
  currentWagerSportsbookAmount: number;
  currentWagerAmount: number;
  openedTransactionsCount: number;
  wagerCasino: number;
  wagerSportsbook: number;
  wageringExpiredAt: string | null;
  maxBetAmount: number | null;
  status: number;
  result: number;
  createdAt: string;
  finishedAt: string | null;
  isBonusCancelLock: boolean;
  requiredWagerCasinoAmount: number;
  requiredWagerSportsbookAmount: number;
  packageId: string;
  packagePriority: number;
  issueSessionId: string;
}

export interface IPlayerFreeSpin extends Record<string, any> {
  id: string;
  name: string;
  status: number;
  result: number;
  count: number;
  usedCount: number;
  progress: number;
  gameId: string;
  activationExpiredAt: string | null;
  wageringExpiredAt: string | null;
  issuedAt: string;
  expiredAt: string | null;
  createdAt: string;
  packageId: string;
  packagePriority: number;
  issueSessionId: string;
}

export interface IBonusCode extends Record<string, any> {
  id: string;
  playerId: string;
  bonusCode: string;
  trigger: number;
  status: number;
  result: number;
  createdAt: string;
}

export interface IPlayerBonusesRequest extends Record<string, any> {
  status?: number[];
  packageId?: string[];
  sortOrder?: 'asc' | 'desc';
  currency?: string[];
  page?: number;
  perPage?: number;
}

export interface IPlayerFreeSpinsRequest extends Record<string, any> {
  status?: number[];
  currency?: string[];
  packageId?: string[];
  sortOrder?: 'asc' | 'desc';
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

export interface IFreeSpinPreset extends Record<string, any> {
  id: string;
  currency: string;
  name: string;
  originalCurrency: string;
  price: number;
  quantity: number;
}

export interface IBonusAssignConditions {
  amountItems?: {
    amount: number;
    currency: string;
  }[];
  baseCurrencyAmount?: number;
  depositPercentage?: number;
  baseCurrencyMaxAmount?: number;
  maxAmountItems?: {
    amount: number;
    currency: string;
  }[];
  freespinDurationMinutes?: number;
  gameId?: string;
  providerId?: string;
  presets?: IFreeSpinPreset[];
}

export interface IBonusTriggerConditions {
  baseCurrencyInvoiceAmountFrom: number | null;
  baseCurrencyInvoiceAmountTo: number | null;
  invoiceAmountItems: IAmountRangeItem[];
  availableFrom?: string;
  availableTo?: string;
}

export interface IBonusWagerCasinoConditions {
  baseCurrencyAmountFrom: number | null;
  baseCurrencyAmountTo: number | null;
  amountItems: IAmountRangeItem[];
  gameIds: string[];
  gameIdsExcluded: boolean;
  providerIds: string[];
  providerIdsExcluded: boolean;
}

export interface IBonusWagerSportsbookConditions {
  baseCurrencyAmountFrom: number | null;
  baseCurrencyAmountTo: number | null;
  amountItems: IAmountRangeItem[];
}

export interface IBonusPackage {
  id: string;
  name: string;
}

export interface IBonus {
  id: string;
  name: string;
  status: number;
  type: number;
  wagerCasino: number;
  wagerSportsbook: number;
  baseCurrencyMaxWinAmount: number | null;
  maxWinAmountItems: {
    amount: number;
    currency: string;
  }[];
  assignConditions: IBonusAssignConditions;
  triggerConditions: IBonusTriggerConditions;
  wagerCasinoConditions: IBonusWagerCasinoConditions;
  wagerSportsbookConditions: IBonusWagerSportsbookConditions;
  package: IBonusPackage | null;
  packagePriority: number;
  packageItems?: IBonus[];
  minDeposit?: {
    amount: number;
    currency: string;
  };
  maxDeposit?: {
    amount: number;
    currency: string;
  };
}

export interface IBonusesStatus {
  id: string;
  status: number;
}

export interface IBonusesRequest extends Record<string, any> {
  currency: string;
  amount?: number;
  bonusIds?: string[];
  questId?: string;
  triggerType?: number;
  skipCondition?: number[];
}

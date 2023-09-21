import { IPaginationMeta } from './globalTypes'

export interface IPlayerBonus extends Record<string, any>{
  id: string;
  playerId: string;
  name: string;
  activationExpiredAt: string|null;
  amount: number;
  bonusType: number;
  currency: string;
  currentWagerPercentage: number;
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

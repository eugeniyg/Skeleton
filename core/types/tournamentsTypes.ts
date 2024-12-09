import type { IPaginationMeta } from './globalTypes';

export interface ITournamentGeneral {
  title: string;
  type: number;
  identity: string;
  confirmationRequired: boolean;
  rates: {
    baseCurrencyRate: number;
    currencyRates?: {
      isoCode: string;
      rate: number;
    }[];
  };
  conditions: {
    gameCollections?: string[];
    gameCollectionsExcluded?: boolean;
    minAmount?: number;
    minAmountOp?: 'gt' | 'gte';
    maxAmount?: number;
    maxAmountOp?: 'lt' | 'lte';
    currencies?: {
      isoCode: string;
      minAmount?: number;
      minAmountOp?: 'gt' | 'gte';
      maxAmount?: number;
      maxAmountOp?: 'lt' | 'lte';
    }[];
  };
  startAt: string;
  endAt: string;
  isRecurring: boolean;
  recurringSettings: {
    duration: number;
    delay: number;
  } | null;
  id: string;
  state: number;
  isAvailable: boolean;
}

export interface ITournamentParticipant {
  playerId: string;
  nickname: string | null;
  place: number | null;
  points: number | null;
}

export interface ITournamentDefinite extends ITournamentGeneral {
  prizes: [];
  playerPlace: number | null;
  leaderboard: ITournamentParticipant[];
}

export interface ITournamentsRequest {
  page?: number;
  perPage?: number;
  state?: number[];
  identity?: string[];
}

export interface ITournamentsResponse {
  data: ITournamentGeneral[];
  meta: IPaginationMeta;
}

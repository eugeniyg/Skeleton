import type { IPaginationMeta } from './globalTypes';

export interface ITournamentPrize {
  place: number;
  type: number;
  title: string;
  bonusId?: string;
  entry?: {
    playerId: string;
    nickname: string;
    points: number;
    createdAt: string;
    updatedAt: string | null;
  };
}

export interface ITournamentParticipant {
  playerId: string;
  nickname: string | null;
  place: number;
  points: number;
}

export interface ITournament {
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
  id: string;
  state: number;
  isAvailable: boolean;
  playerEntry?: {
    points: number;
    place: number;
  } | null;
  prizes?: ITournamentPrize[];
  leaderboard?: ITournamentParticipant[];
}

export interface ITournamentsRequest {
  page?: number;
  perPage?: number;
  state?: number[];
  identity?: string[];
}

export interface ITournamentsResponse {
  data: ITournament[];
  meta: IPaginationMeta;
}

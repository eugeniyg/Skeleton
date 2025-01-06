import type { IPaginationMeta } from './globalTypes';

export interface IGameImages extends Record<string, any> {
  '200x200': {
    '1x': string;
    '2x'?: string;
    '3x'?: string;
  };
  '200x300': {
    '1x': string;
    '2x'?: string;
    '3x'?: string;
  };
}

export interface IGameProvider extends Record<string, any> {
  id: string;
  identity: string;
  name: string;
  gameEnabledCount: number;
  code?: string;
  value?: string;
}

export interface ICollection extends Record<string, any> {
  id: string;
  identity: string;
  name: string;
  countries: string[];
  isHidden: boolean;
}

export interface IGameLabel extends Record<string, any> {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface IGame extends Record<string, any> {
  id: string;
  identity: string;
  name: string;
  isDemoMode: boolean;
  paylines: number;
  volatility: string;
  type: string;
  platforms: number[];
  screenHeightRatio: number | null;
  screenWidthRatio: number | null;
  images: IGameImages;
  customImages: IGameImages;
  provider: IGameProvider;
  collections: ICollection[];
  labels: IGameLabel[];
  isBonusWagering: boolean;
  minimumBonusWagerMultiplier: number;
}

export interface IGamesResponse extends Record<string, any> {
  data: IGame[];
  meta: IPaginationMeta;
}

export interface IProvidersRequest extends Record<string, any> {
  name?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  perPage?: number;
}

export interface IGameStart extends Record<string, any> {
  accountId: string | undefined;
  lobbyUrl: string;
  locale: string;
  countryCode: string;
  platform: number;
  demoMode: boolean;
}

export interface ISpinHistory extends Record<string, any> {
  amount: number;
  createdAt: string;
  currency: string;
  game: string;
  gameIdentity: string;
  id: string;
  payout: number;
}

export interface IBetItem extends Record<string, any> {
  event: string;
  stage: number;
  discipline: string;
  tournament: string;
  eventDate: string;
  market: string;
  outcome: string;
  coefficient: number;
}

export interface IBetHistory extends Record<string, any> {
  id: string;
  game: string;
  amount: number;
  currency: string;
  createdAt: string;
  payout: number;
  items: IBetItem[];
  status: number;
  coefficient: number;
  ticketType: number;
  gameId: string;
  roundId: string;
}

export interface IBetsResponse extends Record<string, any> {
  data: IBetHistory[];
  meta: IPaginationMeta;
}

export interface ISpinsResponse extends Record<string, any> {
  data: ISpinHistory[];
  meta: IPaginationMeta;
}

export interface IWinnersRequest extends Record<string, any> {
  perPage: number;
  platform: number;
  countryCode: string;
}

export interface IRecentlyRequest extends Record<string, any> {
  perPage: number;
  platform: number;
  countryCode: string;
}

export interface IWinner extends Record<string, any> {
  nickname: string;
  amount: number;
  currency: string;
  payout: number;
  gameId: string;
  gameName: string;
  isDemoMode: boolean;
  gameImages: IGameImages;
  gameCustomImages: IGameImages;
}

export interface IGamesRequest extends Record<string, any> {
  providerId?: string[];
  collectionId?: string[];
  gameId?: string[];
  identity?: string[];
  name?: string;
  countries?: string[];
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  perPage?: number;
}

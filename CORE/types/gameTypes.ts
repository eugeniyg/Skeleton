import { PaginationMetaInterface } from './globalDataTypes';

export interface GameImagesInterface {
  '200x200': {
    '1x': string,
    '2x'?: string,
    '3x'?: string,
  },
  '200x300': {
    '1x': string,
    '2x'?: string,
    '3x'?: string,
  }
}

export interface GameProviderInterface {
  id: string,
  identity: string,
  name: string,
  code?: string,
  value?: string,
}

export interface CollectionInterface {
  id: string,
  identity: string,
  name: string
}

export interface GameInterface {
  id: string,
  identity: string,
  name: string,
  isDemoMode: boolean,
  paylines: number,
  volatility: string,
  type: string,
  platforms: number[],
  screenHeightRatio: number|null,
  screenWidthRatio: number|null,
  images: GameImagesInterface,
  provider: GameProviderInterface,
  collections: CollectionInterface[],
}

export interface GamesResponseInterface {
  data: GameInterface[],
  meta: PaginationMetaInterface,
}

export interface GameStartInterface {
  accountId: string,
  lobbyUrl: string,
  locale: string,
  countryCode: string,
  platform: number,
  demoMode: boolean,
}

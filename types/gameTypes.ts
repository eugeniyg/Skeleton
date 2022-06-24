export interface GameInterface {
  id: string,
  identity: string,
  name: string,
  isDemoMode: boolean,
  paylines: number,
  volatility: number,
  platforms: number[],
  screenHeightRatio: number|null,
  screenWidthRatio: number|null
}

export interface CollectionInterface {
  id: string,
  identity: string,
  name: string
}

export interface GameProviderInterface {
  id: string,
  identity: string,
  code?: string,
  value?: string,
}

export interface PaginationMetaInterface {
  page: number,
  perPage: number,
  totalPages: number,
  totalRows: number,
}

export interface GamesResponseInterface {
  data: GameInterface[],
  meta: PaginationMetaInterface,
}

export interface GameInfoInterface extends GameInterface, GameProviderInterface {}

export interface GameStartInterface {
  accountId: string,
  lobbyUrl: string,
  locale: string,
  countryCode: string,
  platform: number,
}

export interface gameInterface {
  id: string,
  identity: string,
  name: string,
  paylines: number,
  volatility: number,
  platforms: number[],
  screenHeightRatio: number|null,
  screenWidthRatio: number|null
}

export interface collectionInterface {
  id: string,
  identity: string,
  games: gameInterface[]
}

export interface gameProviderInterface {
  id: string,
  identity: string,
  code?: string,
  value?: string,
}

export interface paginationMetaInterface {
  page: number,
  perPage: number,
  totalPages: number,
  totalRows: number,
}

export interface gamesResponseInterface {
  data: gameInterface[],
  meta:paginationMetaInterface,
}

export interface gameInfoInterface extends gameInterface, gameProviderInterface {}

export interface gameStartInterface {
  accountId: string,
  lobbyUrl: string,
  locale: string,
  countryCode: string,
  platform: number,
}

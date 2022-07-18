export interface CurrencyInterface {
  code: string,
  symbol: string,
  type: string
  name: string,
  subunitToUnit: number,
  subCurrencies?: CurrencyInterface[],
  value?: string,
}

export interface LocaleInterface {
  name: string,
  nativeName: string,
  code: string,
  languageCode: string,
  isDefault: boolean,
  value?:string,
}

export interface CountryInterface {
  name: string,
  nativeName: string,
  code: string,
  phonePrefix: string,
  value?:string,
}

export interface TimeZoneInterface {
  id: string,
  name: string,
  code?: string,
  value?: string,
}

export interface BrowserLanguageInterface {
  code: string,
  script: null|string,
  region: undefined|string,
  quality: number,
}

export interface ScenariosInterface {
  id: string,
  name: string,
}

export interface CommonDataInterface {
  scenarios: ScenariosInterface[],
  timeZone: TimeZoneInterface[],
}

export interface ObserverOptionsInterface {
  onInView?: Function,
  onOutView?: Function,
  settings: { root: HTMLElement|null, rootMargin: string, threshold: number },
}

export interface PaginationMetaInterface {
  page: number,
  perPage: number,
  totalPages: number,
  totalRows: number,
}

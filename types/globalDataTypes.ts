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
  isDefault: boolean
}

export interface CountryInterface {
  name: string,
  nativeName: string,
  code: string,
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

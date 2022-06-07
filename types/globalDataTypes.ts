export interface CurrencyInterface {
  code: string,
  symbol: string,
  type: string
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

export interface currencyInterface {
  code: string,
  symbol: string,
  type: string
  value?: string,
}

export interface localeInterface {
  name: string,
  nativeName: string,
  code: string,
  languageCode: string,
  isDefault: boolean
}

export interface countryInterface {
  name: string,
  nativeName: string,
  code: string,
  value?:string,
}

export interface timeZoneInterface {
  id: string,
  name: string,
  code?: string,
  value?: string,
}

export interface browserLanguageInterface {
  code: string,
  script: null|string,
  region: undefined|string,
  quality: number,
}

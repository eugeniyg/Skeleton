export interface currencyInterface {
  code: string,
  symbol: string,
  type: string
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
  code: string
}

export interface timeZoneInterface {
  id: string,
  name: string,
}

export interface BrowserLanguageInterface {
  code: string,
  script: null|string,
  region: undefined|string,
  quality: number,
}

export interface PhoneCodeInterface {
  countryCode: string,
  code: string,
  mask?: string,
  value?: string,
}

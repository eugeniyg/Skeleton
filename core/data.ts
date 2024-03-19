
// const currencies = [];
// const countries = [];
// const locales = [];

const GLOBALS = {
  currencies: [],
  countries: [],
  locales: [],
  constants: {},
  // defaultLocale: 'en',
  // defaultCurrency: 'USD',
  // defaultCountry: 'CA',
};

export function setCurrencies(c) {
  GLOBALS.currencies = c;
}

export function setCountries(c) {
  GLOBALS.countries = c;
}

export function setLocales(l) {
  GLOBALS.locales = l;
}

export function getCurrencies() {
  console.log(GLOBALS);
  return GLOBALS.currencies;
}

export function getCountries() {
  return GLOBALS.countries;
}

export function getLocales() {
  return GLOBALS.locales;
}

export function setConstants(c) {
  GLOBALS.constants = c;
}

export function getConstants() {
  return GLOBALS.constants;
}

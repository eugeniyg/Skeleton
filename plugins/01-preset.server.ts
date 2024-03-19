import { getCurrencies, getLocales, getCountries, getConstants } from "../core/data";

export default defineNuxtPlugin(async ():Promise<any> => {
  if(!process.server) {
    return;
  }

  const globalStore = useGlobalStore();
  console.log('presetting server loaded data');

  globalStore.setCurrencies(getCurrencies());
  globalStore.setCountries(getCountries());
  globalStore.setLocales(getLocales());
  globalStore.setSettingsConstants(getConstants());
});

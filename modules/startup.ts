import { defineNuxtModule } from '@nuxt/kit'
import { setCurrencies, setLocales, setCountries, setConstants, getCurrencies } from "../core/data";
import { get } from 'lodash';

const loadData = async (url) => {
  const response = await fetch(process.env.API_BASE_URL + url).then((res) => res.json());
  return response.data;
}

const preloadStartupData = async () => {
  const promises = Promise.all([
    loadData('/api/settings/currencies?visible=1'),
    loadData('/api/settings/countries'),
    loadData('/api/settings/locales'),
    loadData('/api/settings/constants'),
  ]);

  const [currencies, countries, locales, constants] = await promises;

  setCurrencies(currencies);
  setCountries(countries);
  setLocales(locales);
  setConstants(constants);

  getCurrencies();
}

export default defineNuxtModule((options, nuxt) => {
  nuxt.hook('listen', async () => {
    try {
      await preloadStartupData();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    console.log('Loaded startup data');
    setInterval(preloadStartupData, 30000);
  })
});

// export default defineNitroPlugin(async (nitroApp) => {
//   if(!process.env.API_BASE_URL) {
//     return;
//   }

//   try {
//     await preloadStartupData();
//   } catch (e) {
//     console.error(e);
//     process.exit(1);
//   }

//   console.log('Loaded startup data');

//   setInterval(preloadStartupData, 30000);
// });

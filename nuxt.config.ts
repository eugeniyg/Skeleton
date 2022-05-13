import { defineNuxtConfig } from 'nuxt';

const router = require('./nuxt-config/_router.ts');
const build = require('./nuxt-config/_build.ts');

const cssConfig: any = {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/scss/ds/_shared.scss";',
      },
    },
  },
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: [
    '@pinia/nuxt',
  ],
  build,
  router,
  vite: cssConfig,
});

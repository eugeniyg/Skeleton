import { defineNuxtConfig } from 'nuxt';

const router = require('./nuxt-config/_router.ts');

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
  router,
  vite: cssConfig,
});

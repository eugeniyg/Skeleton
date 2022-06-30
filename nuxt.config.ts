import { defineNuxtConfig } from 'nuxt';

const build = require('./nuxt-config/_build.ts');

const viteConfig: any = {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/scss/ds/_shared.scss";',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.API_BASE_URL,
        changeOrigin: true,
      },
    },
  },
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: [
    '@pinia/nuxt',
  ],
  components: {
    dirs: [
      {
        global: true,
        path: '~/components/form/input',
        prefix: 'FormInput',
      },
      {
        global: true,
        path: '~/components/form/dropdown',
        prefix: 'FormDropdown',
      },
      {
        global: true,
        path: '~/components/tab/bonuses',
        prefix: 'TabBonuses',
      },
      {
        global: true,
        path: '~/components/tab/history',
        prefix: 'TabHistory',
      },
      '~/components',
    ],
  },
  app: {
    head: {
      script: [
        { src: '/preloader/preloader.js', defer: true },
      ],
      link: [
        { rel: 'stylesheet', href: '/preloader/preloader.css' },
      ],
    },
  },
  build,
  vite: viteConfig,
});

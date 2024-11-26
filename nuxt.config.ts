import { createResolver } from '@nuxt/kit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { resolve } = createResolver(dirname(fileURLToPath(import.meta.url)));
const buildDate = Date.now();

const viteConfig: any = {
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: '@use "@skeleton/assets/styles/ds/_shared.scss" as *;',
      },
    },
  },
};

export default defineNuxtConfig({
  alias: {
    '@skeleton': resolve('./'),
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/content',
    'dayjs-nuxt',
    'nuxt-lazy-load',
    '@skeleton/modules/optimize-images',
    '@nuxtjs/fontaine',
    '@nuxt/eslint',
  ],
  dayjs: {
    locales: [
      'en-ca',
      'de',
      'fr',
      'es',
      'pt',
      'pt-br',
      'ru',
      'tr',
      'hi',
      'fa',
      'uz',
      'kk',
      'es-mx',
      'it',
      'et',
      'fi',
      'el',
      'id',
      'nb',
      'pl',
      'ro',
      'se',
      'cs',
      'da',
      'nl',
    ],
    plugins: ['localeData', 'isBetween', 'isSameOrAfter', 'isSameOrBefore'],
    defaultLocale: 'en',
  },
  lazyLoad: {
    observerConfig: {
      root: null,
      rootMargin: '400px',
      threshold: 0,
    },
  },
  components: {
    dirs: [
      {
        global: true,
        path: '@skeleton/components/form/input',
        prefix: 'FormInput',
      },
      {
        global: true,
        path: '@skeleton/components/tab/history',
        prefix: 'TabHistory',
      },
      '@skeleton/components',
    ],
  },
  imports: {
    dirs: ['core/composables'],
  },
  routeRules: {
    '/profile/**': {
      appMiddleware: ['auth'],
    },
    '/*/profile/**': {
      appMiddleware: ['auth'],
    },
    '/favorites': {
      appMiddleware: ['auth'],
    },
    '/*/favorites': {
      appMiddleware: ['auth'],
    },
    '/recently-played': {
      appMiddleware: ['auth'],
    },
    '/*/recently-played': {
      appMiddleware: ['auth'],
    },
  },
  experimental: {
    asyncContext: true,
    defaults: {
      useAsyncData: {
        deep: false,
      },
    },
    cookieStore: true,
  },
  app: {
    head: {
      script: [{ src: `/pwa/init.js?v=${buildDate}`, defer: true }],
    },
    pageTransition: true,
    layoutTransition: true,
  },
  css: [
    '@skeleton/assets/styles/style.scss',
    '@skeleton/node_modules/vue-final-modal/dist/style.css',
    '@skeleton/node_modules/vue-skeletor/dist/vue-skeletor.css',
  ],
  vite: viteConfig,
  sourcemap: {
    server: false,
    client: true,
  },
  nitro: {
    logLevel: 0,
    inlineDynamicImports: true,
    devProxy: {
      '/api': {
        target: 'https://test.dev.getplatform.tech/api',
        changeOrigin: true,
      },
    },
  },
  runtimeConfig: {
    public: {
      gamehubCdn: 'https://dev.gcdn.tech',
    },
  },
});

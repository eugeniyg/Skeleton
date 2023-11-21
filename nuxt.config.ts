import { createResolver } from '@nuxt/kit'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const { resolve } = createResolver(dirname(fileURLToPath(import.meta.url)));
const buildDate = Date.now();

const viteConfig: any = {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@skeleton/assets/styles/ds/_shared.scss" as *;',
      },
    },
  }
};

console.log(process.env.NUXT_PUBLIC_GAMEHUB_CDN);

// @ts-ignore
export default defineNuxtConfig({
  alias: {
    '@skeleton': resolve('./'),
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/content',
    'dayjs-nuxt',
    '@nuxtjs/fontaine',
    '@nuxt/image'
  ],
  image: {
    quality: 20,
    format: ['webp'],
    domains: [process.env.NUXT_PUBLIC_GAMEHUB_CDN]
  },
  dayjs: {
    locales: ['en-ca', 'de', 'fr', 'es', 'pt', 'pt-br', 'ru', 'tr', 'hi', 'fa', 'uz', 'kk', 'es-mx', 'it', 'et', 'fi',
      'el', 'id', 'nb', 'pl', 'ro', 'se', 'cs', 'da', 'nl'],
    plugins: ['localeData', 'isBetween', 'isSameOrAfter', 'isSameOrBefore'],
    defaultLocale: 'en',
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
    dirs: [
      'core/composables'
    ]
  },
  experimental: {
    defaults: {
      useAsyncData: {
        deep: false
      }
    }
  },
  app: {
    head: {
      script: [
        { src: `/pwa/init.js?v=${buildDate}`, defer: true }
      ],
    },
    pageTransition: true,
    layoutTransition: true,
  },
  css: [
    '@skeleton/assets/styles/style.scss',
    '@skeleton/node_modules/vue-final-modal/dist/style.css',
  ],
  vite: viteConfig,
  nitro: {
    devProxy: {
      '/api': {
        target: 'https://test.dev.getplatform.tech/api',
        changeOrigin: true,
      },
    },
  },
  runtimeConfig: {
    public: {
      gamehubCdn: process.env.NUXT_PUBLIC_GAMEHUB_CDN || 'https://dev.gcdn.tech'
    }
  }
});

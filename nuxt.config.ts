import { createResolver } from '@nuxt/kit'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const { resolve } = createResolver(dirname(fileURLToPath(import.meta.url)));

const viteConfig: any = {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@skeleton/assets/styles/ds/_shared.scss" as *;',
      },
    },
  },
  optimizeDeps: {
    include: ['centrifuge'],
  },
};

export default defineNuxtConfig({
  alias: {
    '@skeleton': resolve('./'),
  },
  modules: [
    '@pinia/nuxt',
    '@platform/frontend-core',
    '@nuxt/content',
    '@nuxt/image'
  ],
  image: {
    format: ['webp'],
    quality: 80,
    screens: {
      xxs: 360,
      xs: 528,
      sm: 768,
      md: 1024,
      l: 1280,
      xl: 1617,
      xxl: 1833,
      xxxl: 2264,
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
  app: {
    head: {
      script: [
        { src: 'https://turboplatform-dev.betsy.gg/assets/sdk/init.js' },
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
});

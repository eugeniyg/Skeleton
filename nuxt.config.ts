const build = require('./nuxt-config/_build.ts');

const viteConfig: any = {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/scss/ds/_shared.scss" as *;',
      },
    },
  },
  optimizeDeps: {
    include: ['centrifuge'],
  },
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@/modules/localeRoutes',
    '@platform/frontend-core',
    '@nuxt/content',
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
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, user-scalable=0' },
        { name: 'msapplication-TileColor', content: '#da532c' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon/favicon-16x16.png',
        },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#5bbad5' },
        { rel: 'stylesheet', href: '/preloader/preloader.css' },
      ],
    },
  },
  build,
  css: [
    '@/scss/style.scss',
  ],
  vite: viteConfig,
  experimental: {
    writeEarlyHints: false,
    inlineSSRStyles: false,
  },
});

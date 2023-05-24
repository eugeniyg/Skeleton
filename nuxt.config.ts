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

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@platform/frontend-core',
    '@nuxt/content',
    '@/modules/sitemap',
  ],
  content: {
    api: { baseURL: '/_content' },
  },
  components: {
    dirs: [
      {
        global: true,
        path: '~/components/form/input',
        prefix: 'FormInput',
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
      script: [
        { src: 'https://turboplatform-dev.betsy.gg/assets/sdk/init.js' },
        { src: '/scripts/sw-register.js' },
      ],
    },
    pageTransition: true,
    layoutTransition: true,
  },
  css: [
    '@/scss/style.scss',
    'vue-final-modal/style.css',
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

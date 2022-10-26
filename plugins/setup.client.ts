import { useWalletStore } from '~/composables/useWalletStore';
import { useGamesStore } from '~/composables/useGamesStore';

export default defineNuxtPlugin(async (nuxtApp) => {
  const { parseUserAgent } = useGlobalStore();
  // const languages = parser.parse(nuxtApp.ssrContext.req.headers['accept-language']);
  // setBrowserLanguage(languages);
  const { userAgent } = window.navigator;
  parseUserAgent(userAgent);

  nuxtApp.hook('page:finish', () => {
    const route = useRoute();
    const { preloaderDone } = useProjectMethods();
    if (route.name !== 'main' && route.name !== 'locale-main') preloaderDone();
  });

  nuxtApp.hook('app:mounted', async () => {
    const { initWebSocket } = useWebSocket();
    await initWebSocket();
    const bearer = useCookie('bearer');

    if (bearer.value) {
      const { subscribeAccountSocket, subscribeInvoicesSocket } = useWalletStore();
      subscribeAccountSocket();
      subscribeInvoicesSocket();
    }
    const { subscribeWinnersSocket } = useGamesStore();
    subscribeWinnersSocket();
  });

  const setWindowHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setWindowHeight();
});

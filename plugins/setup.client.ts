export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    const route = useRoute();
    const { preloaderDone } = useProjectMethods();
    if (route.name !== 'main' && route.name !== 'locale-main') preloaderDone();
  });

  const setWindowHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setWindowHeight();
});

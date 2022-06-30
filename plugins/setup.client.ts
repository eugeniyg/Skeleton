export default defineNuxtPlugin((nuxtApp) => {
  const finishEvent = new Event('preloader:done', { bubbles: false, cancelable: true });
  nuxtApp.hook('page:finish', () => {
    const route = useRoute();
    if (route.name !== 'main') document.dispatchEvent(finishEvent);
  });

  const setWindowHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setWindowHeight();
});

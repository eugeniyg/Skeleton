export default defineNuxtPlugin((nuxtApp) => {
  const setWindowHeight = ():void => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setWindowHeight();

  const { $_ } = nuxtApp;
  window.addEventListener('resize', $_.throttle(setWindowHeight, 200), true);
});

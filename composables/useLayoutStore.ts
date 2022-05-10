export const useLayoutStore = () => {
  const state = reactive({
    isUserNavOpen: false,
    isDrawerOpen: false,
    isCurrencyNavOpen: false,
    isDrawerCompact: false,
  });

  const getPageElement:any = () => document.querySelector('.main-layout');

  const openUserNav = ():void => {
    state.isUserNavOpen = true;
    document.body.classList.add('nav-user-open');
  };

  const closeUserNav = ():void => {
    state.isUserNavOpen = false;
    document.body.classList.remove('nav-user-open');
  };

  const openCurrencyNav = ():void => {
    state.isCurrencyNavOpen = true;
    document.body.classList.add('nav-currency-open');
  };

  const closeCurrencyNav = ():void => {
    state.isCurrencyNavOpen = false;
    document.body.classList.remove('nav-currency-open');
  };

  const toggleDrawer = ():void => {
    state.isDrawerOpen = !state.isDrawerOpen;
    document.body.classList.toggle('drawer-open');
  };

  const compactDrawer = ():void => {
    state.isDrawerCompact = !state.isDrawerCompact;
    getPageElement().classList.toggle('drawer-minimize');
    window.dispatchEvent(new Event('resize'));
  };

  return {
    ...toRefs(state),
    closeUserNav,
    openUserNav,
    openCurrencyNav,
    closeCurrencyNav,
    toggleDrawer,
    compactDrawer,
  };
};

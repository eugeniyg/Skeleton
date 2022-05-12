const state = reactive({
  isUserNavOpen: false,
  isDrawerOpen: false,
  isCurrencyNavOpen: false,
  isDrawerCompact: false,
  showRegisterModal: false,
  modals: {
    deposit: false,
    withDraw: false,
    successDeposit: false,
    error: false,
    register: false,
    confirm: false,
  },
});

export const useLayoutStore = () => {
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

  const showModal = (modalName: string):void => {
    state.modals[modalName] = true;
    document.body.classList.add('modal-open');
  };

  const closeModal = (modalName: string):void => {
    state.modals[modalName] = false;
    document.body.classList.remove('modal-open');
  };

  return {
    ...toRefs(state),
    closeUserNav,
    openUserNav,
    openCurrencyNav,
    closeCurrencyNav,
    toggleDrawer,
    compactDrawer,
    showModal,
    closeModal,
  };
};

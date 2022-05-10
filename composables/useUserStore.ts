export const useUserStore = () => {
  const state = reactive({
    isLoggedIn: false,
    avatarItems: {
      label: '25 lvl',
      nickname: 'Twiy_nikname_96',
      amount: [0, 0.00004682, 'BTC'],
    },
  });

  const logIn = ():void => {
    state.isLoggedIn = true;
  };

  const logOut = ():void => {
    state.isLoggedIn = false;
  };

  return {
    ...toRefs(state),
    logIn,
    logOut,
  };
};

export default defineNuxtRouteMiddleware((to, from) => {
  const profileStore = useProfileStore();
  const { showPlayLimitAlert } = useLayoutStore();

  if (profileStore.playerStatusName === 'Limited') {
    if (from.name && from.name !== to.name) {
      showPlayLimitAlert();
      return abortNavigation();
    }
  } return true;
});

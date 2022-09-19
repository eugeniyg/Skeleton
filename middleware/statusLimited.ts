export default defineNuxtRouteMiddleware((to, from) => {
  const profileStore = useProfileStore();
  const { alertsData } = useGlobalStore();
  const { showAlert } = useLayoutStore();

  if (profileStore.playerStatusName === 'Limited') {
    if (from.name && from.name !== to.name) {
      showAlert(alertsData?.limitedRealGame);
      return abortNavigation();
    }
  } return true;
});

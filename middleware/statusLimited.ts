export default defineNuxtRouteMiddleware((to, from) => {
  const profileStore = useProfileStore();
  const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
  const { showAlert } = useLayoutStore();

  if (profileStore.profile?.status === 2) {
    if (from.name && from.name !== to.name) {
      showAlert(alertsData?.limitedRealGame || defaultLocaleAlertsData?.limitedRealGame);
      return abortNavigation();
    }
  } return true;
});

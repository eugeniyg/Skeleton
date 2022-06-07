export default defineNuxtRouteMiddleware((to, from) => {
  const profileStore = useProfileStore();

  if (to.name === 'games-id' && !profileStore.isLoggedIn) {
    return abortNavigation();
  }

  if (!profileStore.isLoggedIn) {
    if (from.name && from.path !== to.path) return abortNavigation();
    return navigateTo({ name: 'index' });
  } return true;
});

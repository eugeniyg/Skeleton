export default defineNuxtRouteMiddleware((to, from) => {
  const profileStore = useProfileStore();

  if (to.name === 'games-id' && !profileStore.isLoggedIn) {
    return navigateTo({ name: 'games' });
  } if (!profileStore.isLoggedIn) {
    if (from.name) return abortNavigation();
    return navigateTo({ name: 'index' });
  } return true;
});

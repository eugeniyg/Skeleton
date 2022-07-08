export default defineNuxtRouteMiddleware((to, from) => {
  const profileStore = useProfileStore();
  const { localizePath } = useProjectMethods();

  if ((to.name === 'games-id' || to.name === 'locale-games-id') && !profileStore.isLoggedIn) {
    return abortNavigation();
  }

  if (!profileStore.isLoggedIn) {
    if (from.name && from.path !== to.path) return abortNavigation();
    return navigateTo({ path: localizePath('/') });
  } return true;
});

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (!userStore.isLoggedIn) {
    if (from.name) return abortNavigation();
    return navigateTo({ name: 'index' });
  } return true;
});

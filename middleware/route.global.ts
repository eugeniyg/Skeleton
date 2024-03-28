export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  if (process.client && !nuxtApp.isHydrating) {
    const { getSessionToken, removeSession, isLoggedIn } = useProfileStore();
    const sessionToken = getSessionToken();

    if (isLoggedIn && !sessionToken) removeSession();
  }

  const layoutStore = useLayoutStore();

  if (to.path !== from.path && layoutStore.isShowAlert) {
    layoutStore.hideAlert();
  }

  if (to.fullPath !== from.fullPath && layoutStore.isDrawerOpen) {
    layoutStore.toggleDrawer();
  }
});

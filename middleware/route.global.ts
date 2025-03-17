export default defineNuxtRouteMiddleware((to, from) => {
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const nuxtApp = useNuxtApp();

  if (to.path !== from.path && layoutStore.isShowAlert) {
    layoutStore.hideAlert();
  }

  if (to.fullPath !== from.fullPath && layoutStore.isDrawerOpen) {
    layoutStore.toggleDrawer();
  }

  if (to.query.source === 'pwa' && !profileStore.isPwaRoute) {
    profileStore.isPwaRoute = true;
    if (import.meta.client && !nuxtApp.isHydrating) profileStore.checkPwaDetect();
  }
});

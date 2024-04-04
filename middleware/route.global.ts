export default defineNuxtRouteMiddleware((to, from) => {
  const layoutStore = useLayoutStore();

  if (to.path !== from.path && layoutStore.isShowAlert) {
    layoutStore.hideAlert();
  }

  if (to.fullPath !== from.fullPath && layoutStore.isDrawerOpen) {
    layoutStore.toggleDrawer();
  }
});

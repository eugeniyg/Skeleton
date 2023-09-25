export default defineNuxtRouteMiddleware((from, to) => {
  const layoutStore = useLayoutStore();

  if (to.path !== from.path && layoutStore.isShowAlert) {
    layoutStore.hideAlert();
  }

  if (to.fullPath !== from.fullPath && layoutStore.isDrawerOpen) {
    layoutStore.toggleDrawer();
  }
});

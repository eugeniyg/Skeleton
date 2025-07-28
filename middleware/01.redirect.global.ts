export default defineNuxtRouteMiddleware(to => {
  if (import.meta.client) return;

  const routeLocaleCode = to.params.locale;
  const globalStore = useGlobalStore();
  const currentLocaleCode = globalStore.currentLocale?.code;

  if (routeLocaleCode && currentLocaleCode !== routeLocaleCode) {
    const pathWithoutLocale = to.fullPath.slice(routeLocaleCode.length + 1);
    return navigateTo(localizePath(pathWithoutLocale));
  } else if (!routeLocaleCode && currentLocaleCode !== globalStore.defaultLocale?.code) {
    return navigateTo(localizePath(to.fullPath));
  }
});

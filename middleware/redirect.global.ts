export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;

  const nuxtApp = useNuxtApp()
  const routeLocaleCode = to.params.locale;
  const globalStore = useGlobalStore();
  const currentLocaleCode = globalStore.currentLocale?.code;
  const { localizePath } = useProjectMethods();

  if (nuxtApp.isHydrating && currentLocaleCode) {
    console.log('middleware-current-locale: ', globalStore.currentLocale?.code || 'empty');
    if (routeLocaleCode && currentLocaleCode !== routeLocaleCode) {
      const pathWithoutLocale = to.fullPath.slice(routeLocaleCode.length + 1);
      return navigateTo(localizePath(pathWithoutLocale));
    } else if (!routeLocaleCode && currentLocaleCode !== globalStore.defaultLocale?.code) {
      return navigateTo(localizePath(to.fullPath));
    }
  }
});
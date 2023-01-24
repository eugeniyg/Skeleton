export default defineNuxtRouteMiddleware((to, from) => {
  const cookieLanguage = useCookie('user-language');
  const { getSessionToken } = useCoreAuthStore();
  const token = getSessionToken();
  const needChangeLanguage = to.name && !to.params.locale && !!cookieLanguage.value;
  const { localizePath } = useProjectMethods();

  if (!needChangeLanguage && !token) {
    if (from.name && from.path !== to.path) return abortNavigation();
    return navigateTo({ path: localizePath('/') });
  }
});

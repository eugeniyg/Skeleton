export default defineNuxtRouteMiddleware((to, from) => {
  const cookieLanguage = useCookie('user-language');
  const bearer = useCookie('bearer');
  const needChangeLanguage = to.name && !to.params.locale && !!cookieLanguage.value;
  const { localizePath } = useProjectMethods();

  if (!needChangeLanguage && !bearer.value) {
    if (from.name && from.path !== to.path) return abortNavigation();
    return navigateTo({ path: localizePath('/') });
  }
});

// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware((to, from) => {
  const { getSessionToken } = useProfileStore();
  const sessionToken = getSessionToken();
  const { localizePath } = useProjectMethods();
  const { showModal } = useLayoutStore();

  if (!sessionToken) {
    if (from?.path && to?.path && from.path !== to.path) {
      showModal('signIn');
      return abortNavigation();
    } else {
      return navigateTo({ path: localizePath('/'), query: { 'sign-in': 'true' } });
    }
  }
});

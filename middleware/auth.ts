// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useProfileStore();
  const { localizePath } = useProjectMethods();
  const { showModal } = useLayoutStore();

  if (!isLoggedIn) {
    if (from?.path && to?.path && from.path !== to.path) {
      showModal('signIn');
      return abortNavigation();
    } else {
      return navigateTo({ path: localizePath('/'), query: { 'sign-in': 'true' } });
    }
  }
});

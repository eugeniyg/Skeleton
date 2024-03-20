// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware((to, from) => {
  const { getSessionToken } = useProfileStore();
  const sessionToken = getSessionToken();
  const { localizePath } = useProjectMethods();


  if (!sessionToken) {
    if (process.server) {
      return navigateTo({ path: localizePath('/'), query: { 'sign-in': 'true' } });
    }

    const layoutStore = useLayoutStore();
    layoutStore.modals.signIn = true;
    const fromProfilePath = from.path?.includes('/profile/');

    if (fromProfilePath) {
      return navigateTo({ path: localizePath('/'), query: { 'sign-in': 'true' } });
    }
    return navigateTo({ query: { ...from.query, 'sign-in': 'true' } });
  }
});

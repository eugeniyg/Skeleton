// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware((to, from) => {
  const { getSessionToken } = useProfileStore();
  const sessionToken = getSessionToken();
  const { localizePath } = useProjectMethods();
  const fromRouteName = from.name as string;
  const fromProfilePath = from.path?.includes('/profile');
  const fromFavoritesPath = fromRouteName === 'favorites' || fromRouteName === 'locale-favorites';
  const fromRecentlyPlayedPath = fromRouteName === 'recently-played' || fromRouteName === 'locale-recently-played';
  const fromAuthPage = fromProfilePath || fromFavoritesPath || fromRecentlyPlayedPath;

  if (!sessionToken) {
    if (process.server) {
      return navigateTo({ path: localizePath('/'), query: { 'sign-in': 'true' } });
    }

    const layoutStore = useLayoutStore();
    layoutStore.modals.signIn = true;

    if (fromAuthPage) {
      return navigateTo({ path: localizePath('/'), query: { 'sign-in': 'true' } });
    }
    return navigateTo({ query: { ...from.query, 'sign-in': 'true' } });
  }
});

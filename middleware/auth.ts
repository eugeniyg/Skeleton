 
export default defineNuxtRouteMiddleware((to, from) => {
  const { getSessionToken } = useProfileStore();
  const sessionToken = getSessionToken();
  const { localizePath } = useProjectMethods();
  const fromRouteName = from.name as string;
  const fromProfilePath = from.path?.includes('/profile');
  const fromFavoritesPath = fromRouteName === 'favorites' || fromRouteName === 'locale-favorites';
  const fromRecentlyPlayedPath = fromRouteName === 'recently-played' || fromRouteName === 'locale-recently-played';
  const fromAuthPage = fromProfilePath || fromFavoritesPath || fromRecentlyPlayedPath;
  const layoutStore = useLayoutStore();

  if (!sessionToken) {
    if (import.meta.server) {
      return navigateTo({ path: localizePath('/'), query: { 'sign-in': 'true' } });
    } else if (fromAuthPage) {
      layoutStore.modals.signIn = true;
      return navigateTo({ path: localizePath('/'), query: { 'sign-in': 'true' } });
    } else {
      layoutStore.modals.signIn = true;
      return navigateTo({ query: { ...from.query, 'sign-in': 'true' } });
    }
  }
});

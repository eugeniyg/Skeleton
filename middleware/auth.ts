export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getSessionToken } = useProfileStore();
  const sessionToken = getSessionToken();
  const { localizePath } = useProjectMethods();
  const fromRouteName = from.name as string;
  const fromProfilePath = from.path?.includes('/profile');
  const fromFavoritesPath = fromRouteName === 'favorites' || fromRouteName === 'locale-favorites';
  const fromRecentlyPlayedPath = fromRouteName === 'recently-played' || fromRouteName === 'locale-recently-played';
  const fromAuthPage = fromProfilePath || fromFavoritesPath || fromRecentlyPlayedPath;

  if (!sessionToken) {
    if (import.meta.server) {
      return navigateTo(localizePath('/?sign-in=true'));
    } else if (fromAuthPage) {
      const profileStore = useProfileStore();
      if (profileStore.isLoggedIn) profileStore.removeSession();
      const { openModal } = useModalStore();
      await openModal('sign-in', { prohibitQueryChange: false });
      return navigateTo(localizePath('/?sign-in=true'));
    } else {
      const profileStore = useProfileStore();
      if (profileStore.isLoggedIn) profileStore.removeSession();
      const { openModal } = useModalStore();
      await openModal('sign-in', { prohibitQueryChange: false });
      return navigateTo({ query: { ...from.query, 'sign-in': 'true' } });
    }
  }
});

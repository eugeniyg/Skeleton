export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  if (import.meta.server || !nuxtApp.isHydrating) return;

  const profileStore = useProfileStore();
  const token = profileStore.getSessionToken();

  if (!profileStore.isLoggedIn && token) {
    const { getProfileData } = useProfileStore();
    const { getUserAccounts } = useWalletStore();

    try {
      await Promise.all([getProfileData(), getUserAccounts()]);
    } catch {
      console.log('User logged out!');
    }
  }
});

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.params.confirmCode) {
    const { confirmProfile } = useCoreProfileApi();
    try {
      await confirmProfile(to.params.confirmCode as string);
      return navigateTo('/?confirm=true', { replace: true });
    } catch {
      return navigateTo('/', { replace: true });
    }
  } else return navigateTo('/', { replace: true });
});

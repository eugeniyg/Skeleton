export default defineNuxtRouteMiddleware(async (to) => {
  const { localizePath } = useProjectMethods();
  const { needToChangeLanguage } = useProjectMethods();

  if (!needToChangeLanguage()) {
    if (to.params.confirmCode) {
      const { confirmProfile } = useCoreProfileApi();
      try {
        await confirmProfile(to.params.confirmCode as string);
        return navigateTo(localizePath('/?confirm=true'), { replace: true });
      } catch {
        return navigateTo(localizePath('/'), { replace: true });
      }
    } else return navigateTo(localizePath('/'), { replace: true });
  }
});

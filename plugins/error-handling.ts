export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', async (err:any) => {
    if (err?.response?.status === 401) {
      const { logOutUser } = useProfileStore();
      await logOutUser();
      return;
    }

    showError(err);
  });
});

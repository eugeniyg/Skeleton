export default defineNuxtPlugin((nuxtApp) => {
  const errorStatusesHandling = [400, 404, 500];
  nuxtApp.hook('vue:error', async (err:any) => {
    if (err?.response?.status === 401) {
      const { logOutUser } = useProfileStore();
      return logOutUser(false);
    }

    if (errorStatusesHandling.includes(err?.response?.status)) {
      return throwError(err);
    }
    return err;
  });
});

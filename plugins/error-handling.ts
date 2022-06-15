export default defineNuxtPlugin((nuxtApp) => {
  const errorStatusesHandling = [400, 404, 500];
  nuxtApp.hook('vue:error', (err:any) => {
    if (errorStatusesHandling.includes(err?.response?.status)) {
      return throwError(err);
    }
    return err;
  });
});

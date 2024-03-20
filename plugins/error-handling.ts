export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (err:any) => {
    showError(err);
  });
});

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('vue:error', (err: any) => {
    if (err.response?.status === 401 || err.response?.status === 403) return;

    showError(err);
  });
});

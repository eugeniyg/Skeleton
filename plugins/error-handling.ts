export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (err:any) => {
    if (err?.response?.status === 401) {
      const { localizePath } = useProjectMethods();
      const router = useRouter();
      router.push(localizePath('/'));
    } else {
      showError(err);
    }
  });
});

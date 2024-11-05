<template>
  <not-found/>
</template>

<script setup lang="ts">
  onBeforeMount(async () => {
    const { query } = useRoute();
    if (!query.state) return;

    const { isLoggedIn, autoLogin, removeSession } = useProfileStore();
    const { localizePath } = useProjectMethods();
    const { openWalletModal } = useLayoutStore();
    const { openModal } = useModalStore();
    const router = useRouter();

    if (isLoggedIn) removeSession();

    try {
      await autoLogin(query.state as string);
      const redirectUrlQuery = query.redirectUrl ?? '';
      const redirectAbsoluteUrl = new URL(window.location.origin + redirectUrlQuery);
      const queryParams = new URLSearchParams(redirectAbsoluteUrl.search);
      queryParams.set('wallet', 'true');
      await openWalletModal();
      const redirectRelativeUrl = `${redirectAbsoluteUrl.pathname}?${queryParams.toString()}`;
      router.replace(localizePath(redirectRelativeUrl));
    } catch {
      await openModal('sign-in', undefined, false);
      await router.replace(localizePath('/?sign-in=true'));
    }
  })
</script>

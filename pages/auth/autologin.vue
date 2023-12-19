<template>
  <not-found/>
</template>

<script setup lang="ts">
onBeforeMount(async () => {
  const { query } = useRoute();
  if (!query.state) return;

  const { isLoggedIn, autoLogin, logOutUser } = useProfileStore();
  const { localizePath } = useProjectMethods();
  const { openWalletModal, showModal} = useLayoutStore();
  const router = useRouter();

  if (isLoggedIn) {
    await logOutUser();
  }

  try {
    await autoLogin(query.state as string);
    await openWalletModal();
    router.replace(localizePath('/?wallet=deposit'));
  } catch {
    showModal('signIn');
    router.replace(localizePath('/?sign-in=true'));
  }
})
</script>

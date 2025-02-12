<template>
  <not-found />
</template>

<script setup lang="ts">
  const router = useRouter();
  const { localizePath } = useProjectMethods();
  const { showAlert } = useLayoutStore();
  const { openModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const sendSocialData = async (code: string, connection: string): Promise<void> => {
    try {
      const { loginSocial } = useProfileStore();
      await loginSocial(code, connection);
    } catch (err: any) {
      const errorCode = err.data?.error?.code;

      if (errorCode === 11002) {
        await router.replace(localizePath('/'));
        showAlert(alertsData.value?.profile?.accountBlocked || defaultLocaleAlertsData.value?.profile?.accountBlocked);
      } else if (errorCode === 11001) {
        const profileStore = useProfileStore();
        profileStore.socialAuthEmailError = true;
        const { openModal } = useModalStore();
        await openModal('sign-in', { prohibitQueryChange: false });
        await router.replace(localizePath('/?sign-in=true'));
      } else {
        await openModal('sign-up');
        await router.replace(localizePath('/?sign-up=true'));
      }
    }
  };

  onBeforeMount(async () => {
    const { query, params } = useRoute();
    if (!query.code || !params.connection) return;
    await sendSocialData(query.code as string, params.connection as string);
  });
</script>

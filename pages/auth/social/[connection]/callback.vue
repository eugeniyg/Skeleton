<template>
  <not-found />
</template>

<script setup lang="ts">
  import type { ISocialCallbackData } from '@skeleton/core/types';

  const router = useRouter();
  const { localizePath } = useProjectMethods();
  const { showAlert } = useLayoutStore();
  const { openModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const sendSocialData = async (data: ISocialCallbackData): Promise<void> => {
    try {
      const { loginSocial } = useProfileStore();
      await loginSocial(data);
    } catch (err: any) {
      const errorCode = err.data?.error?.code;

      if (errorCode === 11002) {
        await router.replace(localizePath('/'));
        showAlert(alertsData.value?.profile?.accountBlocked || defaultLocaleAlertsData.value?.profile?.accountBlocked);
      } else if (errorCode === 11001) {
        const profileStore = useProfileStore();
        profileStore.socialAuthEmailError = true;
        await openModal('sign-in', { prohibitQueryChange: false });
        await router.replace(localizePath('/?sign-in=true'));
      } else {
        await openModal('sign-up', { prohibitQueryChange: false });
        await router.replace(localizePath('/?sign-up=true'));
      }
    }
  };

  onBeforeMount(async () => {
    const { query, params } = useRoute();
    await sendSocialData({
      connection: params.connection as string,
      appState: query.state as string,
      code: query.code as string,
    });
  });
</script>

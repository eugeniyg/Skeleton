<template>
  <not-found />
</template>

<script setup lang="ts">
  import type { IAuthState } from '@skeleton/core/types';

  const router = useRouter();
  const { localizePath } = useProjectMethods();
  const { showAlert } = useLayoutStore();
  const { openModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData, currentLocale } = storeToRefs(globalStore);

  const sendSocialData = async (socialData: any, authState?: IAuthState): Promise<void> => {
    try {
      const { loginSocial } = useProfileStore();
      await loginSocial(
        {
          ...socialData,
          locale: currentLocale.value?.code,
          socialDataKey: 'id_token',
        },
        authState
      );
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
    const { query } = useRoute();
    if (!query.code) return;
    console.log(query);

    // try {
    //   await sendSocialData();
    // } catch {
    //   await openModal('sign-up');
    //   await router.replace(localizePath('/?sign-up=true'));
    // }
  });
</script>

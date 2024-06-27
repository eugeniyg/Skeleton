<template>
  <not-found/>
</template>

<script setup lang="ts">
import type { IAuthState } from "@skeleton/core/types";

const router = useRouter();
const { localizePath } = useProjectMethods();
const { showModal, showAlert } = useLayoutStore();
const globalStore = useGlobalStore();
const { alertsData, defaultLocaleAlertsData, currentLocale } = storeToRefs(globalStore);

const sendSocialData = async (socialData: any, authState?: IAuthState): Promise<void> => {
  try {
    const { loginSocial } = useProfileStore();
    await loginSocial({
      ...socialData,
      locale: currentLocale.value?.code,
      socialDataKey: 'id_token',
    }, authState);
  } catch (err:any) {
    const errorCode = err.data?.error?.code;

    if (errorCode === 11002) {
      await router.replace(localizePath('/'));
      showAlert(alertsData.value?.profile?.accountBlocked || defaultLocaleAlertsData.value?.profile?.accountBlocked);
    } else if (errorCode === 11001) {
      const profileStore = useProfileStore();
      profileStore.socialAuthEmailError = true;
      showModal('signIn');
      await router.replace(localizePath('/?sign-in=true'));
    } else {
      showModal('register');
      await router.replace(localizePath('/?sign-up=true'));
    }
  }
}

onBeforeMount(async () => {
  const { query } = useRoute();
  const { $auth0 } = useNuxtApp();

  if (!query.code || !query.state || !$auth0) return;

  try {
    const { appState } = await $auth0.handleRedirectCallback();
    const auth0TokenData = await $auth0.getTokenSilently({ detailedResponse: true });

    if (auth0TokenData) await sendSocialData(auth0TokenData, appState);
  } catch {
    showModal('register');
    await router.replace(localizePath('/?sign-up=true'));
  }
})
</script>
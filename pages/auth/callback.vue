<template>
  <not-found/>
</template>

<script setup lang="ts">
  const router = useRouter();
  const { localizePath } = useProjectMethods();
  const { showModal } = useLayoutStore();

  onBeforeMount(async () => {
    const { query } = useRoute();
    if (!query.code || !query.state) return;

    const { $auth0 } = useNuxtApp();
    try {
      const { appState } = await $auth0.handleRedirectCallback();
      console.log('appState: ', appState);

      const auth0TokenData = await $auth0.getTokenSilently({ detailedResponse: true });
      console.log('auth0TokenData: ', auth0TokenData);

      const { loginSocial } = useProfileStore();
      await loginSocial({
        login: 'tarakan@front.dev',
        password: 'Aa123456&'
      });

      router.replace(appState?.targetUrl || localizePath('/'));
    } catch {
      showModal('signIn');
      await router.replace(localizePath('/?sign-in=true'));
    }
  })
</script>
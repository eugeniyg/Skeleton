<template>
  <div class="user-profile">
    <nav-profile :items="menu.profile"/>

    <client-only>
      <NuxtPage :key="`profile-child${$route.fullPath}`" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  const { getProfileFields } = useFieldsStore();
  await useAsyncData('profileFields', getProfileFields);

  const { menu } = useFakeStore();
  const { needToChangeLanguage } = useProjectMethods();

  if (!needToChangeLanguage()) {
    const { localizePath } = useProjectMethods();
    const route = useRoute();
    const bearer = useCookie('bearer');

    if (route.params.confirmCode) {
      const { confirmProfile } = useCoreProfileApi();
      try {
        await confirmProfile(route.params.confirmCode as string);
        navigateTo(localizePath('/?confirm=true'), { replace: true });
      } catch {
        navigateTo(localizePath('/'), { replace: true });
      }
    } else if (!bearer.value) {
      navigateTo(localizePath('/'), { replace: true });
    }
  }
</script>

<style lang="scss" src="./profile/style.scss"/>

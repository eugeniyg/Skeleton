<template>
  <div class="user-profile">
    <nav-profile :items="menu.profile"/>

    <client-only>
      <NuxtPage :key="`profile-child${$route.fullPath}`" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  const { getProfileFields } = useProfileStore();
  await useAsyncData('profileFields', getProfileFields);

  const { menu } = useFakeStore();

  definePageMeta({
    middleware: () => {
      const bearer = useCookie('bearer');

      if (!bearer.value) {
        return navigateTo({ name: 'index' });
      } return true;
    },
  });
</script>

<style lang="scss" src="./profile/style.scss"/>

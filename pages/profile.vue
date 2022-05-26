<template>
  <div class="user-profile">
    <nav-profile :items="menu.profile"/>

    <NuxtPage :page-key="`profile-child${$route.fullPath}`" />
  </div>
</template>

<script setup lang="ts">
  const { getProfileFields } = useUserStore();
  await useAsyncData('profileFields', async () => { await getProfileFields(); });

  definePageMeta({
    middleware: ['auth'],
  });
  const { menu } = useFakeStore();
</script>

<style lang="scss" src="./profile/style.scss"/>

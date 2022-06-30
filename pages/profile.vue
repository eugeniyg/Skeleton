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

  // definePageMeta({
  //   middleware: ['auth'],
  // });
  const { menu } = useFakeStore();
</script>

<style lang="scss" src="./profile/style.scss"/>

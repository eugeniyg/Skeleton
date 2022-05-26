<template>
  <div class="user-profile">
    <nav-profile :items="menu.profile"/>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });
  const {
    getProfileFields,
  } = useUserStore();
  await useAsyncData('profileFields', getProfileFields);
  const { menu } = useFakeStore();
</script>

<style lang="scss" src="./profile/style.scss"/>

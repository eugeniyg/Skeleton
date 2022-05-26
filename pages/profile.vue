<template>
  <div class="user-profile">
    <nav-profile :items="menu.profile"/>
    <h1 style="color: white">{{ dima }}</h1>

    <NuxtPage :page-key="`profile-child${$route.fullPath}`" />
  </div>
</template>

<script setup lang="ts">
  const { getProfileFields } = useUserStore();
  const dima = await useAsyncData('profileFields', getProfileFields);

  definePageMeta({
    middleware: ['auth'],
  });
  const { menu } = useFakeStore();
</script>

<style lang="scss" src="./profile/style.scss"/>

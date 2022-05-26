<template>
  <div class="user-profile">
    <nav-profile :items="menu.profile"/>
    <h1 style="color: white">{{ dima || 'dima' }}</h1>

    <NuxtPage :page-key="`profile-child${$route.fullPath}`" />
  </div>
</template>

<script setup lang="ts">
  const { getProfileFields } = useUserStore();
  const { data } = await useAsyncData('profileFields', getProfileFields, { server: true });
  const dima = data.value;

  definePageMeta({
    middleware: ['auth'],
  });
  const { menu } = useFakeStore();
</script>

<style lang="scss" src="./profile/style.scss"/>

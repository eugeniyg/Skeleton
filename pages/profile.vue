<template>
  <div class="user-profile">
    <nav-profile :items="menu.profile"/>

    <NuxtPage :page-key="$route.path" />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });
  const { menu } = useFakeStore();
</script>

<style lang="scss" src="./profile/style.scss"/>

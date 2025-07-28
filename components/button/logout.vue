<template>
  <button class="btn-logout" @click="emit('logout')">
    <atomic-icon id="log-out" />
    {{ getContent(layoutData, defaultLocaleLayoutData, 'profileSidebar.logoutButton') }}
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['logout']);
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
</script>

<style src="~/assets/styles/components/button/logout.scss" lang="scss" />

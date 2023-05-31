<template>
  <button class="btn-logout" @click="emit('logout')">
    <atomic-icon id="log-out"/>
    {{ getContent(userNavigationContent, defaultLocaleUserNavigationContent, 'logoutButton') }}
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['logout']);
  const { getContent } = useProjectMethods();
  const { userNavigationContent, defaultLocaleUserNavigationContent } = useGlobalStore();
</script>

<style src="~/assets/styles/components/button/logout.scss" lang="scss" />


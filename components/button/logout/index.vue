<template>
  <button class="btn-logout" @click="emit('logout')">
    <atomic-icon id="log-out"/>
    {{ userNavigationContent?.logoutButton }}
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['logout']);
  const { userNavigationContent } = useGlobalStore();
</script>

<style lang="scss" src="./style.scss"/>

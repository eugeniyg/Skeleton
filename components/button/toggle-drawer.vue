<template>
  <div class="toggle-drawer">
    <button-base @click="emit('toggle-minimize')" data-action="minimize">
      <atomic-icon id="menu-open"/>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['toggle-minimize']);
</script>

<style src="~/assets/styles/components/button/toggle-drawer.scss" lang="scss" />


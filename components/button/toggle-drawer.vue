<template>
  <div class="toggle-drawer">
    <button-base data-action="minimize" @click="emit('toggle-minimize')">
      <atomic-icon id="menu-open"/>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['toggle-minimize']);
</script>

<style src="~/assets/styles/components/button/toggle-drawer.scss" lang="scss" />


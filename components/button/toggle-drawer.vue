<template>
  <div class="toggle-drawer">
    <button-base @click="emit('toggle-minimize')" data-action="minimize">
      <atomic-icon id="arrow_expand-close"/>
    </button-base>
    <button-base @click="emit('toggle-open')" data-action="open">
      <atomic-icon id="arrow_expand-close"/>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['toggle-minimize', 'toggle-open']);
</script>

<style src="~/assets/styles/components/button/toggle-drawer.scss" lang="scss" />


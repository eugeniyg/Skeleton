<template>
  <button class="btn-show-more" @click="onClick">
    <slot />
    <atomic-icon id="arrow-expand-close" />
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['show-more']);
  function onClick(): void {
    emit('show-more');
  }
</script>

<style src="~/assets/styles/components/button/show-more.scss" lang="scss" />

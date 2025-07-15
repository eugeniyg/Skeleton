<template>
  <button class="btn-modal-close" @click.prevent="emit('close')">
    <atomic-icon id="arrow-previous" />
    <atomic-icon id="close" />
  </button>
</template>
<script setup lang="ts">
  const emit = defineEmits(['close']);
</script>

<style src="~/assets/styles/components/button/modal-close.scss" lang="scss" />

<template>
  <button class="btn-modal-close" @click.prevent="emit('close')">
    <atomic-icon id="arrow_previous"/>
    <atomic-icon id="close"/>
  </button>
</template>
<script setup lang="ts">
  const emit = defineEmits(['close']);
</script>

<style lang="scss" src="./style.scss"/>

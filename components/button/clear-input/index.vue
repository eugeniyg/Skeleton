<template>
  <button class="btn-clear-input" @click.prevent="clickAction">
    <atomic-icon id="close"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clear-input']);
  const clickAction = () => emit('clear-input');
</script>

<style lang="scss" src="./style.scss"></style>

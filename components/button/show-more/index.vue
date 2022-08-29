<template>
  <button class="btn-show-more" @click="onClick">
    <slot>Show more</slot>
    <atomic-icon id="arrow_expand-close"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['show-more']);
  function onClick():void {
    emit('show-more');
  }
</script>

<style lang="scss" src="./style.scss"/>

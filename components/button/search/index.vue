<template>
  <button class="btn-search" @click="onClick">
    <atomic-icon id="search"/>
  </button>
</template>

<script setup lang="ts">
  const emits = defineEmits(['show-search']);

  function onClick():void {
    emits('show-search');
  }
</script>

<style lang="scss" src="./style.scss"/>

<template>
  <button class="btn-info" @click="onClick">
    <atomic-icon id="info"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['game-play']);

  function onClick(e:Event):void {
    emit('game-play', e);
  }
</script>

<style src="~/assets/styles/components/button/info.scss" lang="scss" />


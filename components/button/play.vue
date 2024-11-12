<template>
  <button class="btn-play" @click="onClick">
    <span class="icon-box">
      <atomic-icon id="play" />
    </span>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['game-play']);

  function onClick(e: Event): void {
    emit('game-play', e);
  }
</script>

<style src="~/assets/styles/components/button/play.scss" lang="scss" />

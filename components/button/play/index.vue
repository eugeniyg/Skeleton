<template>
  <button class="btn-play" @click="onClick">
    <atomic-icon id="play"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['game-play']);

  function onClick(e:Event):void {
    emit('game-play', e);
  }
</script>

<style lang="scss" src="./style.scss"/>

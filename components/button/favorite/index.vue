<template>
  <button class="btn-favorite" @click="onClick">
    <atomic-icon id="ui-heart-outline"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['add-to-favorites']);

  function onClick(e:Event):void {
    emit('add-to-favorites', e);
  }
</script>

<style lang="scss" src="./style.scss"/>

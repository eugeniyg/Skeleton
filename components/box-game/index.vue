<template>
  <div class="box-game">
    <div class="container">
      <iframe :src="props.frameLink" height="100%" width="100%"/>
    </div>
    <nav-game/>
    <panel-mode/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    frameLink: {
      type: String,
      required: true,
    },
    gameInfo: {
      type: Object,
      required: true,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>

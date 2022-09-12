<template>
  <div class="nav-game">
    <nav-action :gameInfo="props.gameInfo" />
    <!--    <nav-mode :items="modeItems"/>-->
  </div>
</template>

<script setup lang="ts">
  import { GameInterface } from '@platform/frontend-core/dist/module';

  const props = defineProps<{
    gameInfo: GameInterface
  }>();
</script>

<style lang="scss" src="./style.scss"/>

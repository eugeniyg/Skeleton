<template>
  <div class="nav-game">
    <nav-action :showPlug="showPlug" :gameInfo="props.gameInfo" />
    <!--    <nav-mode :items="modeItems"/>-->
  </div>
</template>

<script setup lang="ts">
  import { GameInterface } from '@platform/frontend-core/dist/module';

  const props = defineProps<{
    gameInfo: GameInterface,
    showPlug: boolean,
  }>();
</script>

<style lang="scss" src="./style.scss"/>

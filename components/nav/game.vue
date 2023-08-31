<template>
  <div class="nav-game">
    <nav-action :showPlug="showPlug" :gameInfo="props.gameInfo" />
    <!--    <nav-mode :items="modeItems"/>-->
  </div>
</template>

<script setup lang="ts">
  import { IGame } from '@platform/frontend-core';

  const props = defineProps<{
    gameInfo: IGame,
    showPlug: boolean,
  }>();
</script>

<style src="~/assets/styles/components/nav/game.scss" lang="scss" />


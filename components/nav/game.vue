<template>
  <div class="nav-game">
    <nav-action :show-plug="showPlug" :game-info="props.gameInfo" />
  </div>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/api/types';

  const props = defineProps<{
    gameInfo: IGame;
    showPlug: boolean;
  }>();
</script>

<style src="~/assets/styles/components/nav/game.scss" lang="scss" />

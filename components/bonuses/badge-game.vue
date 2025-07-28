<template>
  <nuxt-link v-if="gameInfo" class="bonuses-badge-game" :to="`/games/${props.gameInfo.identity}?real=true`">
    <atomic-icon id="gamepad" class="bonuses-badge-game__icon" />
    <span class="bonuses-badge-game__text">{{ props.gameInfo.name }}</span>
  </nuxt-link>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/api/types';

  const props = defineProps<{
    gameInfo: IGame;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/badge-game.scss" lang="scss" />

<template>
  <nuxt-link class="bonuses-badge-game" :to="`/games/${gameIdentity}?real=true`">
    <atomic-icon id="gamepad" class="bonuses-badge-game__icon"/>
    <span class="bonuses-badge-game__text">{{ props.gameName || 'Game Name' }}</span>
  </nuxt-link>
</template>

<script setup lang="ts">
  const props = defineProps<{
    gameName: string;
    gameIdentity: string;
  }>()
</script>

<style src="~/assets/styles/components/bonuses/badge-game.scss" lang="scss"/>
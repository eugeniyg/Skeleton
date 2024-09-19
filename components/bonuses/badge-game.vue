<template>
  <nuxt-link v-if="gameInfo" class="bonuses-badge-game" :to="`/games/${gameInfo.identity}?real=true`">
    <atomic-icon id="gamepad" class="bonuses-badge-game__icon"/>
    <span class="bonuses-badge-game__text">{{ gameInfo.name }}</span>
  </nuxt-link>
</template>

<script setup lang="ts">
  import type { IGame, IPlayerFreeSpin } from "@skeleton/core/types";

  const props = defineProps<{
    bonusInfo: Record<string, any>;
  }>()
  
  const gameInfo = ref<IGame|undefined>();
  
  const getGameInfo = async ():Promise<void> => {
    const gameId = (props.bonusInfo as IPlayerFreeSpin).gameId || props.bonusInfo.assignConditions?.gameId;
    if (!gameId) return;

    try {
      const { getGamesInfo } = useCoreGamesApi();
      gameInfo.value = await getGamesInfo(gameId);
    } catch {
      gameInfo.value = undefined;
    }
  }
  
  onMounted(() => {
    getGameInfo();
  })
</script>

<style src="~/assets/styles/components/bonuses/badge-game.scss" lang="scss"/>
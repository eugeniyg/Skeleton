<template>
  <button class="btn-favorite" :class="{ active: isActive }" @click="toggleFavorite">
    <atomic-icon id="heart-outline"/>
  </button>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    gameId: {
      type: String,
      required: true,
    },
  });

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);

  const isActive = computed(() => favoriteGames.value.map((game) => game.id).includes(props.gameId));

  const toggleFavorite = async ():Promise<void> => {
    if (favoriteGames.value.find((game) => game.id === props.gameId)) {
      await gameStore.deleteFavoriteGame(props.gameId);
    } else await gameStore.setFavoriteGame(props.gameId);
  };
</script>

<style lang="scss" src="./style.scss"/>

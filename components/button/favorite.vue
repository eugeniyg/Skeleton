<template>
  <button class="btn-favorite" :class="{ active: isActive }" @click="toggleFavorite">
    <atomic-icon :id="isActive ? 'heart' : 'heart-outline'" />
  </button>
</template>

<script setup lang="ts">
  const props = defineProps<{ gameId: string }>();

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);

  const isActive = computed(() => favoriteGames.value.map(game => game.id).includes(props.gameId));

  const toggleFavorite = async (): Promise<void> => {
    if (favoriteGames.value.find(game => game.id === props.gameId)) {
      await gameStore.deleteFavoriteGame(props.gameId);
    } else await gameStore.setFavoriteGame(props.gameId);
  };
</script>

<style src="~/assets/styles/components/button/favorite.scss" lang="scss" />

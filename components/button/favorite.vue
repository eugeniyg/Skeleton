<template>
  <button class="btn-favorite" :class="{ active: isActive }" @click="toggleFavorite">
    <atomic-icon id="heart-outline"/>
  </button>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{gameId: string}>();

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);

  const isActive = computed(() => favoriteGames.value.map((game) => game.id).includes(props.gameId));

  const toggleFavorite = async ():Promise<void> => {
    if (favoriteGames.value.find((game) => game.id === props.gameId)) {
      await gameStore.deleteFavoriteGame(props.gameId);
    } else await gameStore.setFavoriteGame(props.gameId);
  };
</script>

<style lang="scss">
.btn-favorite {
  @include box(24px);
  border-radius: 50%;
  @extend %skip-btn;
  @extend %flex-all-center;
  transition: all .2s ease-in-out;
  box-shadow: var(--shadow, unset);
  padding: 0;

  --icon-size: #{rem(18px)};
  --padding: 0;
  --color: var(--gray-400);

  &:hover {
    cursor: pointer;
    --bg: var(--gray-800);

    .icon {
      --icon-color: var(--yellow-500);
    }
  }

  &.active {
    .icon {
      --color: var(--yellow-500);
    }
  }
}
</style>

<template>
  <button class="btn-favorite" :class="{ active: isActive }" @click="toggleFavorite">
    <atomic-icon id="heart-outline"/>
  </button>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{ gameId: string }>();

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);

  const isActive = computed(() => favoriteGames.value.map((game) => game.id).includes(props.gameId));

  const toggleFavorite = async (): Promise<void> => {
    if (favoriteGames.value.find((game) => game.id === props.gameId)) {
      await gameStore.deleteFavoriteGame(props.gameId);
    } else await gameStore.setFavoriteGame(props.gameId);
  };
</script>

<style lang="scss">
.btn-favorite {
  display: flex;
  justify-content: center;
  align-items: center;
  @extend %skip-btn;
  padding: 0;
  border-radius: 8px;
  background-color: var(--bgc, transparent);
  transition: all .2s ease-in-out;
  width: var(--width, #{rem(24px)});
  height: var(--height, #{rem(24px)});
  margin-left: auto;
  --icon-size: 20px;
  --color: var(--violet-100);

  &.active {
    --bgc: var(--violet-900);
    --color: var(--yellow-500);
  }

  @include use-hover {
    &:hover {
      cursor: pointer;
      --bgc: var(--violet-900);
      --color: var(--yellow-500);
    }
  }
}
</style>

<template>
  <div class="nav-action">
    <button class="item" @click="closeGame">
      <atomic-icon id="close" />
    </button>

    <button v-if="!props.showPlug" class="item" @click="toggleFullScreen">
      <atomic-icon id="video-expand" />
    </button>

    <client-only>
      <button v-if="isLoggedIn" class="item" :class="{ 'is-active': isFavorite }" @click="toggleFavorite">
        <atomic-icon :id="isFavorite ? 'heart' : 'heart-outline'" />
      </button>
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/api/types';

  const props = defineProps<{
    gameInfo: IGame;
    showPlug: boolean;
  }>();

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const router = useRouter();

  const closeGame = (): void => {
    if (window.history.state.back) {
      router.back();
    } else {
      router.push(localizePath('/'));
    }
  };

  const toggleFullScreen = (): void => {
    const elem: any = document.querySelector('.box-game .container');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  const isFavorite = computed(() => favoriteGames.value.map(game => game.id).includes(props.gameInfo.id));
  const toggleFavorite = async (): Promise<void> => {
    if (favoriteGames.value.find(game => game.id === props.gameInfo.id)) {
      await gameStore.deleteFavoriteGame(props.gameInfo.id);
    } else await gameStore.setFavoriteGame(props.gameInfo.id);
  };
</script>

<style src="~/assets/styles/components/nav/action.scss" lang="scss" />

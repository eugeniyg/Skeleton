<template>
  <div class="nav-action">
    <button
      class="item"
      @click="closeGame"
    >
      <atomic-icon id="close"/>
    </button>

    <button
      class="item"
      @click="toggleFullScreen"
    >
      <atomic-icon id="video-expand"/>
    </button>

    <button
      v-if="isLoggedIn"
      class="item"
      @click="toggleFavorite"
      :class="{ 'is-active': isFavorite }"
    >
      <atomic-icon id="heart-outline"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    gameInfo: {
      type: Object,
      required: true,
    },
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const router = useRouter();
  const { localizePath } = useProjectMethods();

  const closeGame = ():void => {
    if (window.history.state.back) {
      router.back();
    } else {
      router.push(localizePath('/'));
    }
  };

  const toggleFullScreen = ():void => {
    const elem:any = document.querySelector('.box-game .container');
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
  const isFavorite = computed(() => favoriteGames.value.map((game) => game.id).includes(props.gameInfo.id));
  const toggleFavorite = async ():Promise<void> => {
    if (favoriteGames.value.find((game) => game.id === props.gameInfo.id)) {
      await gameStore.deleteFavoriteGame(props.gameInfo.id);
    } else await gameStore.setFavoriteGame(props.gameInfo.id);
  };
</script>

<style lang="scss" src="./style.scss"/>

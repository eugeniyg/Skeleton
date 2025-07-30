<template>
  <div class="game-return">
    <atomic-image class="game-return__background" :src="gameImage" />

    <div class="game-return__container">
      <nuxt-link :to="localizePath(`/games/${game.identity}?real=true`)">
        <atomic-image class="game-return__game-image" :src="gameImage" />
      </nuxt-link>

      <div class="game-return__content">
        <div>{{ getContent(layoutData, defaultLocaleLayoutData, 'returnGame.playLabel') }}</div>
        <div>{{ game?.name }}</div>
      </div>

      <div class="game-return__controls">
        <nuxt-link :to="localizePath(`/games/${game.identity}?real=true`)">
          <atomic-icon id="play" />
        </nuxt-link>

        <atomic-icon id="close" @click="setReturnGame('disabled')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/api/types';
  import { getGameImageUrl } from '@skeleton/helpers/urlBuildMethods';

  const props = defineProps<{
    game: IGame;
  }>();

  const globalStore = useGlobalStore();
  const { setReturnGame } = useLayoutStore();
  const { layoutData, defaultLocaleLayoutData } = storeToRefs(globalStore);

  const gameImage = computed(() => getGameImageUrl(props.game.customImages, props.game.images, 'square'));
</script>

<style src="~/assets/styles/components/layout/game-return.scss" lang="scss" />

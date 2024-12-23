<template>
  <div v-if="gamesArray.length" class="list-games" :class="{ 'is-compact': props.isCompact }">
    <nuxt-link
      v-for="(game, index) in gamesArray"
      :key="index"
      class="item"
      :to="localizePath(`/games/${game.identity}${!isLoggedIn ? '' : '?real=true'}`)"
    >
      <atomic-image class="img" :src="getImageUrl(game.customImages, game.images, 'square')" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IGame } from '@skeleton/core/types';

  const props = defineProps<{
    items: string[];
    isCompact?: boolean;
  }>();

  const { localizePath } = useProjectMethods();
  const profileStore = useProfileStore();
  const globalStore = useGlobalStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { headerCountry } = storeToRefs(globalStore);
  const gamesArray = ref<IGame[]>([]);
  const { getImageUrl } = useProjectMethods();

  onMounted(async () => {
    const { getFilteredGames } = useCoreGamesApi();
    const { data } = await getFilteredGames({
      identity: props.items,
      countries: headerCountry.value ? [headerCountry.value] : undefined,
    });
    gamesArray.value = data.sort((prevGame, nextGame) => {
      const prevIndex = props.items?.indexOf(prevGame.identity) || -1;
      const nextIndex = props.items?.indexOf(nextGame.identity) || -1;
      return prevIndex - nextIndex;
    });
  });
</script>

<style src="~/assets/styles/components/list/games.scss" lang="scss" />

<template>
  <div v-if="gamesArray.length" class="list-games" :class="{ 'is-compact': props.isCompact }">
    <nuxt-link
      v-for="(game, index) in gamesArray"
      :key="index"
      class="item"
      :to="localizePath(`/games/${game.identity}${!isLoggedIn ? '' : '?real=true'}`)"
    >
      <atomic-image class="img" :src="getGameImageUrl(game.customImages, game.images, 'square')" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/api/types';
  import { getFilteredGames } from '@skeleton/api/games';
  import { getGameImageUrl } from '@skeleton/helpers/urlBuildMethods';

  const props = defineProps<{
    items: string[];
    isCompact?: boolean;
  }>();

  const profileStore = useProfileStore();
  const globalStore = useGlobalStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { headerCountry } = storeToRefs(globalStore);
  const gamesArray = ref<IGame[]>([]);

  onMounted(async () => {
    try {
      const { data } = await getFilteredGames({
        identity: props.items,
        countries: headerCountry.value ? [headerCountry.value] : undefined,
      });
      gamesArray.value = data.sort((prevGame, nextGame) => {
        const prevIndex = props.items?.indexOf(prevGame.identity) || -1;
        const nextIndex = props.items?.indexOf(nextGame.identity) || -1;
        return prevIndex - nextIndex;
      });
    } catch (error: any) {
      console.error(error);
    }
  });
</script>

<style src="~/assets/styles/components/list/games.scss" lang="scss" />

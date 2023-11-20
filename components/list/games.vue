<template v-if="gamesArray.length">
  <div class="list-games" :class="{'is-compact' : props.isCompact}">
    <nuxt-link
      v-for="(game, index) in gamesArray"
      :key="index"
      class="item"
      :to="localizePath(`/games/${game.identity}${!isLoggedIn ? '' : '?real=true' }`)"
      noPrefetch
    >
      <atomic-image class="img" v-if="game.images['200x200']" :src="getImageUrl(game.images, 'square')" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IGame } from '@skeleton/core/types';

  const props = defineProps<{
    items: string[],
    isCompact?: boolean
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
    const { data } = await getFilteredGames({ identity: props.items, countries: headerCountry.value ? [headerCountry.value] : undefined });
    gamesArray.value = data.reduce((acc: IGame[], item: IGame) => {
      const getGameIndex = props.items?.findIndex((gameIdentity) => gameIdentity === item.identity);
      if (getGameIndex > -1) acc[getGameIndex] = item;
      return acc;
    }, []);
  });
</script>

<style src="~/assets/styles/components/list/games.scss" lang="scss" />


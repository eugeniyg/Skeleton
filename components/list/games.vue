<template v-if="gamesArray.length">
  <div class="list-games" :class="{'is-compact' : props.isCompact}">
    <nuxt-link
      v-for="(game, index) in gamesArray"
      :key="index"
      class="item"
      :to="localizePath(`/games/${game.identity}${!isLoggedIn ? '' : '?real=true' }`)"
    >
      <img class="img" v-if="game.images['200x200']" :src="getImageUrl(game.images, 'square')" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { GameImagesInterface, GameInterface } from '@platform/frontend-core/dist/module';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
  });

  const { localizePath } = useProjectMethods();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const gamesArray = ref<GameInterface[]>([]);

  const { baseApiUrl } = useGlobalStore();
  const { getImageUrl } = useProjectMethods();

  onMounted(async () => {
    const { getFilteredGames } = useCoreGamesApi();
    const { data } = await getFilteredGames({ identity: props.items });
    gamesArray.value = data.reduce((acc: GameInterface[], item: GameInterface) => {
      const getGameIndex = props.items?.findIndex((gameIdentity) => gameIdentity === item.identity);
      if (getGameIndex > -1) acc[getGameIndex] = item;
      return acc;
    }, []);
  });
</script>

<style src="~/assets/styles/components/list/games.scss" lang="scss" />


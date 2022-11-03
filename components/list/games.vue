<template v-if="gamesArray.length">
  <div class="list-games" :class="{'is-compact' : props.isCompact}">
    <nuxt-link
      v-for="(game, index) in gamesArray"
      :key="index"
      class="item"
      :to="localizePath(`/games/${game.identity}${!isLoggedIn ? '?demo=true' : '' }`)"
    >
      <img class="img" v-if="game.images['200x200']" :src="gameImageSrc(game.images)" />
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
  const gameImageSrc = (imagesData: GameImagesInterface):string => `${baseApiUrl}/img/gcdn${getImageUrl(imagesData, 'square')}`;

  onMounted(async () => {
    const { getFilteredGames } = useCoreGamesApi();
    const { data } = await getFilteredGames({ identity: props.items });
    gamesArray.value = data;
  });
</script>

<style lang="scss">
.list-games {
  background-color: var(--gray-900);
  @extend %flex-items-center;
  grid-column-gap: rem(8px);
  padding: var(--padding, #{rem(8px)});
  border-radius: 8px;
  max-width: rem(200px);
  margin: 0 auto;

  .item {
    overflow: hidden;
    display: block;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
  }

  .img {
    display: block;
    max-width: 100%;
    transition: max-width .2s ease-in-out;
    width: var(--img-width, #{rem(40px)});
    min-width: var(--img-width, #{rem(40px)});
    height: var(--img-height, #{rem(40px)});
  }

  .is-compact & {
    @include media(l) {
      .item:not(:first-child) {
        display: none;
      }

      //--padding-left: 0;
      --img-width: #{rem(40px)};
      --img-height: #{rem(40px)};

      padding: 0;
    }
  }
}
</style>

<template>
  <div class="result-search" :class="{'is-show': props.isShow}">
    <div class="box">
      <div class="header" v-if="!props.items.length">
        <div class="heading">{{ headerContent?.search?.emptyLabel }}</div>
        <div class="text">{{ headerContent?.search?.emptyText }}</div>
      </div>

      <div class="items">
        <div class="label" v-if="!props.items.length">{{ headerContent?.search?.tryLabel }}</div>

        <div
          v-for="game in activeItems"
          :key="game.id"
          class="item"
          @click="clickGame(game)"
        >
          <img v-if="game.images['200x200']" :src="gameImageSrc(game.images)" />
          <img v-else src="/img/default-game-tumb.png" />
          <span>{{ game.name }}</span>
        </div>

        <div class="footer" v-if="isShowLoadMore">
          <button-base type="ghost" size="xs" @click="emit('loadMore')">{{ headerContent?.search?.moreButton }}</button-base>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { GameImagesInterface, GameInterface } from '@platform/frontend-core/dist/module';

  const props = defineProps({
    isShow: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    defaultItems: {
      type: Array,
      default: () => [],
    },
    isShowLoadMore: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['loadMore', 'hideSearch']);

  const activeItems = computed(() => (props.items.length ? props.items : props.defaultItems));

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const router = useRouter();

  const { localizePath } = useProjectMethods();
  const clickGame = (gameData: GameInterface):void => {
    if (!isLoggedIn.value) {
      router.push(localizePath(`/games/${gameData.identity}${gameData.isDemoMode ? '' : '?real=true'}`));
    } else router.push(localizePath(`/games/${gameData.identity}?real=true`));
    emit('hideSearch');
  };

  const { baseApiUrl, headerContent } = useGlobalStore();
  const { getImageUrl } = useProjectMethods();
  const gameImageSrc = (imagesData: GameImagesInterface):string => `${baseApiUrl}/img/gcdn${getImageUrl(imagesData, 'square')}`;
</script>

<style lang="scss">
.result-search {
  border-radius: 8px;
  max-height: rem(360px);
  overflow: hidden;
  padding: rem(8px);
  background-color: var(--gray-800);
  transform: translateY(rem(4px));
  position: absolute;
  left: 0;
  right: 0;
  display: none;

  .box {
    max-height: calc(#{rem(360px)} - #{rem(16px)});
    background-color: var(--gray-800);
    overflow-y: auto;
    overflow-x: hidden;

    @extend %scrollbar;
  }

  .items {
    padding: rem(8px) rem(8px) rem(8px) rem(8px);
  }

  img {
    display: inline-block;
    width: rem(40px);
    height: rem(40px);
    object-fit: cover;
  }

  .item {
    display: flex;
    align-items: center;
    padding: rem(4px);
    grid-column-gap: rem(8px);
    background-color: var(--bg, transparent);
    color: var(--color, var(--white));
    @include font($heading-1);
    min-height: rem(48px);
    white-space: nowrap;
    border-radius: 8px;
    transition: all .2s ease-in-out;

    &:hover {
      cursor: pointer;
      --bg: var(--gray-900);
      --color: var(--yellow-500);
    }

    span {
      display: inline-block;
      max-width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &.is-show {
    display: block;
  }

  .header {
    display: grid;
    grid-gap: rem(8px);
    padding: rem(8px) rem(16px);
    border-bottom: 1px solid var(--gray-700);
  }

  .heading {
    @include font($heading-2);
    color: var(--white);
    padding: 0;
    margin: 0;
  }

  .label {
    @include font($body-2);
    color: var(--white);
    padding: rem(8px) rem(16px) rem(8px) 0;
  }

  .text {
    @include font($body-1);
    color: var(--gray-400);
    padding: 0;
    margin: 0;
  }

  .footer {
    margin-top: rem(8px);
    border-top: 1px solid var(--gray-700);
    padding: rem(8px) 0 0 0;
  }

  .btn-ghost {
    --width: 100%;
  }
}
</style>

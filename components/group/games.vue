<template>
  <div class="group-games">
    <atomic-icon v-if="titleIcon && !props.subTitle" :id="titleIcon"/>

    <div v-if="props.subTitle" class="titles">
      <h2 class="title">
        {{ gameCategoriesObj[props.category.identity]?.label || props.category.name || props.category.identity }}
      </h2>
      <h4 class="sub-title">{{ cardsGroupContent?.recommendedSubtitle }}</h4>
    </div>

    <h2 v-else class="title">
      {{ gameCategoriesObj[props.category.identity]?.label || props.category.name || props.category.identity }}
    </h2>

    <button-base
      v-if="props.showAllBtn"
      class="btn-show-all"
      type="ghost"
      @click="openGames"
    >
      {{ cardsGroupContent?.moreButton }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prevDisabled="prevDisabled"
      :nextDisabled="nextDisabled"
      @clickAction="clickAction"
    />

    <div
      ref="scrollContainer"
      class="items"
      :class="{ 'disabled-scroll-block': !games.length }"
      @scroll="scrollHandler"
    >
      <template v-if="games.length">
        <card-base
          v-for="(game, gameIndex) in games"
          :key="gameIndex"
          v-bind="game"
        />
      </template>

      <template v-else>
        <div v-for="n in 9" :key="n" class="card-base" />
      </template>

      <div class="load-more" ref="loadMore"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    GameInterface, PaginationMetaInterface,
  } from '@platform/frontend-core/dist/module';
  import { CardsGroupInterface } from '~/types';

  const props = defineProps({
    category: {
      type: Object,
      required: true,
    },
    subTitle: {
      type: Boolean,
      required: false,
    },
    showAllBtn: {
      type: Boolean,
      default: false,
    },
    showArrows: {
      type: Boolean,
      default: true,
    },
  });

  const { globalComponentsContent, gameCategoriesObj } = useGlobalStore();
  const cardsGroupContent:CardsGroupInterface|undefined = globalComponentsContent?.cardsGroup;
  const titleIcon = gameCategoriesObj[props.category.identity]?.icon;

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(true);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const games = ref<GameInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();
  const { getFilteredGames } = useCoreGamesApi();

  const scrollHandler = ():void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20)
      && pageMeta.value?.page === pageMeta.value?.totalPages;
  };

  const clickAction = (direction: string):void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth : -offsetWidth,
      behavior: 'smooth',
    });
  };

  const moreGames = async ():Promise<void> => {
    if (pageMeta.value?.page === pageMeta.value?.totalPages) return;

    const gamesResponse = await getFilteredGames({
      collectionId: props.category.id,
      page: pageMeta.value ? pageMeta.value.page + 1 : 1,
      perPage: 18,
    });
    games.value = games.value.concat(gamesResponse.data);
    pageMeta.value = gamesResponse.meta;
  };

  const loadMore = ref();
  const { initObserver } = useCoreMethods();

  const emit = defineEmits(['initialLoad']);
  onMounted(async () => {
    initObserver(loadMore.value, {
      onInView: moreGames,
      settings: { root: scrollContainer.value, rootMargin: '90%', threshold: 0 },
    });

    const gamesResponse = await getFilteredGames({ collectionId: props.category.id, perPage: 18 });
    games.value = gamesResponse.data;
    pageMeta.value = gamesResponse.meta;
    await nextTick();
    emit('initialLoad');

    if (props.showArrows) {
      scrollHandler();
      showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
    }
  });

  const { localizePath } = useProjectMethods();
  const openGames = ():void => {
    const router = useRouter();
    router.push(localizePath(`/games?category=${props.category.identity}`));
  };
</script>

<style lang="scss">
.group-games {
  display: grid;
  align-items: center;
  grid-template-areas:
    "icon heading heading arrows"
    "items items items items"
    "btn-show-all btn-show-all btn-show-all btn-show-all";
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto) minmax(0, auto);
  grid-column-gap: var(--column-gap, #{rem(8px)});
  grid-row-gap: var(--row-gap, #{rem(16px)});

  @include media(xs) {
    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
  }

  > [data-icon] {
    font-size: rem(20px);
    grid-area: icon;
  }

  > .icon {
    grid-area: icon;
    margin-left: rem(16px);
    --icon-size: #{rem(20px)};
    --color: var(--gray-400);

    @include media(sm) {
      margin-left: rem(24px);
    }
  }

  > .btn-show-all {
    grid-area: btn-show-all;
    @include font($heading-1);

    --font-size: #{rem(12px)};
    --color: var(--gray-500);
    --width: auto;

    @include media(xs) {
      padding: 0;
      --bg: transparent;

      &:hover {
        --color: var(--white);
        --bg: transparent;
      }
    }
  }

  > .arrows {
    grid-area: arrows;
    margin-right: rem(16px);

    @include media(sm) {
      margin-left: rem(24px);
      margin-right: rem(24px);
    }
  }

  > .title {
    flex-grow: 1;
    grid-area: heading;
    @include font($heading-4);
    color: var(--white);
    margin: 0;
  }

  > .items {
    grid-area: items;
    display: var(--display, flex);
    align-items: center;
    overflow-x: auto;
    margin: 0 rem(-16px) 0;
    padding: 0 rem(16px);
    scroll-padding: rem(16px);
    grid-column-gap: 8px;
    scroll-snap-type: x mandatory;

    @include media(sm) {
      margin: 0;
      padding: 0;
      grid-column-gap: 16px;
      scroll-padding: 0;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    &.disabled-scroll-block {
      pointer-events: none !important;
    }
  }

  .load-more {
    width: 0;
    height: 0;
    visibility: hidden;
    margin-left: rem(-8px);
  }

  .titles {
    .title {
      @include font($heading-4);
      color: var(--white);
      margin: 0;
    }

    .sub-title {
      @include font($body-2);
      color: var(--gray-400);
      margin: 0;
    }
  }
}
</style>

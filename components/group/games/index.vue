<template>
  <div class="group-games">
    <atomic-icon v-if="titleIcon && !props.subTitle" :id="titleIcon"/>

    <div v-if="props.category.name && props.subTitle" class="titles">
      <h2 class="title">{{ props.category.name }}</h2>
      <h4 class="sub-title">{{ props.subTitle }}</h4>
    </div>

    <h2 v-else class="title">{{ props.category.name || props.category.identity }}</h2>

    <button-base
      v-if="props.showAllBtn"
      class="btn-show-all"
      type="ghost"
      @click="openGames"
    >
      Show all
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
      @scroll="scrollHandler"
    >
      <card-base
        v-for="(game, gameIndex) in games"
        :key="gameIndex"
        v-bind="game"
      />

      <div class="load-more" ref="loadMore"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GameInterface, PaginationMetaInterface } from '~/types/gameTypes';
  import { useGamesApi, useGlobalMethods } from '~/CORE';

  const props = defineProps({
    category: {
      type: Object,
      required: true,
    },
    subTitle: {
      type: String,
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

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const { sortedCategories } = useGamesStore();
  const titleIcon = sortedCategories[props.category.identity];
  const games = ref<GameInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();
  const { getFilteredGames } = useGamesApi();

  const scrollHandler = async ():Promise<void> => {
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = (scrollWidth === Math.floor(scrollLeft) + offsetWidth) && pageMeta.value?.page === pageMeta.value?.totalPages;
  };

  const clickAction = (goNext: boolean):void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: goNext ? offsetWidth : -offsetWidth,
      behavior: 'smooth',
    });
  };

  const moreGames = async ():Promise<void> => {
    if (pageMeta.value?.page === pageMeta.value?.totalPages) return;
    const gamesResponse = await getFilteredGames({
      collectionId: props.category.id,
      page: pageMeta.value.page + 1,
      perPage: 18,
    });
    games.value = games.value.concat(gamesResponse.data);
    pageMeta.value = gamesResponse.meta;
  };

  const loadMore = ref();
  const { initObserver } = useGlobalMethods();

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

  const openGames = ():void => {
    const router = useRouter();
    router.push(`/games?category=${props.category.identity}`);
  };
</script>

<style lang="scss" src="./style.scss"/>

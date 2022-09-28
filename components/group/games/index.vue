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
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const games = ref<GameInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();
  const { getFilteredGames } = useCoreGamesApi();

  const scrollHandler = async ():Promise<void> => {
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
      page: pageMeta.value.page + 1,
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

<style lang="scss" src="./style.scss"/>

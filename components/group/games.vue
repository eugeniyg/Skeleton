<template>
  <div v-if="showBlock" class="group-games">
    <atomic-icon v-if="titleIcon && !props.subTitle" :id="titleIcon" />

    <div v-if="props.subTitle" class="titles">
      <h2 class="title">
        {{ gameCategoriesObj[props.category.identity]?.label || props.category.name || props.category.identity }}
      </h2>
      <h4 class="sub-title">
        {{
          getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.recommendedSubtitle')
        }}
      </h4>
    </div>

    <h2 v-else class="title">
      {{ gameCategoriesObj[props.category.identity]?.label || props.category.name || props.category.identity }}
    </h2>

    <button-base v-if="props.showAllBtn" class="btn-show-all" type="ghost" size="sm" @click="openGames">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.moreButton') }}
      {{ pageMeta?.totalRows }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prev-disabled="prevDisabled"
      :next-disabled="nextDisabled"
      @click-action="clickAction"
    />

    <div
      ref="scrollContainer"
      class="items"
      :class="{ 'disabled-scroll-block': !games.length }"
      @scroll="scrollHandler"
    >
      <template v-if="games.length">
        <card-base v-for="(game, gameIndex) in games" :key="gameIndex" :game-info="game" />
      </template>

      <template v-else>
        <Skeletor v-for="n in 9" :key="n" class="card-base" as="div" />
      </template>

      <div ref="loadMore" class="load-more" @inview="moreGames" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame, IPaginationMeta } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';
  import { Skeletor } from 'vue-skeletor';

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

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent, gameCategoriesObj } = globalStore;
  const { headerCountry } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const titleIcon = gameCategoriesObj[props.category.identity]?.icon;

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(true);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const games = ref<IGame[]>([]);
  const pageMeta = ref<IPaginationMeta>();
  const { getFilteredGames } = useCoreGamesApi();

  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value =
      scrollWidth < scrollLeft + offsetWidth + 20 &&
      scrollWidth > scrollLeft + offsetWidth - 20 &&
      pageMeta.value?.page === pageMeta.value?.totalPages;
  };

  const clickAction = (direction: string): void => {
    const { offsetWidth, scrollWidth, scrollLeft } = scrollContainer.value;
    const widthToEnd = scrollWidth - (scrollLeft + offsetWidth);
    const scrollLeftValue = widthToEnd < offsetWidth ? widthToEnd : offsetWidth;
    const scrollRightValue = scrollLeft < offsetWidth ? scrollLeft : offsetWidth;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? scrollLeftValue : -scrollRightValue,
      behavior: 'smooth',
    });
  };

  const defaultRequestParams = {
    collectionId: props.category.id,
    perPage: 18,
    countries: headerCountry.value ? [headerCountry.value] : undefined,
    sortBy: 'default',
    sortOrder: 'asc',
  };

  const moreGames = async (): Promise<void> => {
    if (pageMeta.value?.page === pageMeta.value?.totalPages) return;

    const gamesResponse = await getFilteredGames({
      ...defaultRequestParams,
      page: pageMeta.value ? pageMeta.value.page + 1 : 1,
    });
    games.value = games.value.concat(gamesResponse.data);
    pageMeta.value = gamesResponse.meta;
  };

  const loadMore = ref();
  const { initObserver } = useProjectMethods();
  const observerLoadMore = ref();

  const emit = defineEmits(['initialLoad']);
  const showBlock = ref<boolean>(true);
  onMounted(async () => {
    observerLoadMore.value = initObserver({
      settings: { root: scrollContainer.value, rootMargin: '90%', threshold: 0 },
    });
    observerLoadMore.value.observe(loadMore.value);

    const gamesResponse = await getFilteredGames(defaultRequestParams);
    if (!gamesResponse.data.length) return (showBlock.value = false);
    games.value = gamesResponse.data;
    pageMeta.value = gamesResponse.meta;
    await nextTick();

    emit('initialLoad');

    if (props.showArrows) {
      scrollHandler();
      showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
    }
  });

  onBeforeUnmount(() => {
    if (loadMore.value && observerLoadMore.value) {
      observerLoadMore.value.unobserve(loadMore.value);
    }
  });

  const { localizePath } = useProjectMethods();
  const openGames = (): void => {
    const router = useRouter();
    router.push(localizePath(`/categories/${props.category.identity}`));
  };
</script>

<style src="~/assets/styles/components/group/games.scss" lang="scss" />

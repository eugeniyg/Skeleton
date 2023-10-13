<template>
  <div class="group-games">
    <atomic-icon v-if="titleIcon && !props.subTitle" :id="titleIcon"/>

    <div v-if="props.subTitle" class="titles">
      <h2 class="title">
        {{ gameCategoriesObj[props.category.identity]?.label || props.category.name || props.category.identity }}
      </h2>
      <h4 class="sub-title">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.recommendedSubtitle') }}
      </h4>
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
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.moreButton') }}
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
          :gameInfo="game"
        />
      </template>

      <template v-else>
        <div v-for="n in 9" :key="n" class="card-base"/>
      </template>

      <div class="load-more" ref="loadMore"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IGame, IPaginationMeta } from '@skeleton/core/types';
  import { storeToRefs } from "pinia";

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
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20)
      && pageMeta.value?.page === pageMeta.value?.totalPages;
  };

  const clickAction = (direction: string): void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth : -offsetWidth,
      behavior: 'smooth',
    });
  };

  const defaultRequestParams = {
    collectionId: props.category.id,
    perPage: 18,
    countries: headerCountry.value ? [headerCountry.value] : undefined,
    sortBy: 'default',
    sortOrder: 'asc'
  }

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

  const emit = defineEmits(['initialLoad']);
  onMounted(async () => {
    initObserver(loadMore.value, {
      onInView: moreGames,
      settings: { root: scrollContainer.value, rootMargin: '90%', threshold: 0 },
    });

    const gamesResponse = await getFilteredGames(defaultRequestParams);
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
  const openGames = (): void => {
    const router = useRouter();
    router.push(localizePath(`/games?category=${props.category.identity}`));
  };
</script>

<style src="~/assets/styles/components/group/games.scss" lang="scss" />


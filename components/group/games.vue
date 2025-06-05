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
  import type { ICollection, IGame, IPaginationMeta } from '@skeleton/core/types';
  import { Skeletor } from 'vue-skeletor';

  const props = withDefaults(
    defineProps<{
      category: ICollection;
      subTitle?: boolean;
      showAllBtn?: boolean;
      showArrows?: boolean;
    }>(),
    {
      subTitle: false,
      showAllBtn: false,
      showArrows: true,
    }
  );

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
    collectionId: [props.category.id],
    perPage: 18,
    countries: headerCountry.value ? [headerCountry.value] : undefined,
    sortBy: 'score',
    sortOrder: 'asc',
  };

  const moreGames = async (): Promise<void> => {
    if (pageMeta.value?.page === pageMeta.value?.totalPages) return;

    try {
      const gamesResponse = await getFilteredGames({
        ...defaultRequestParams,
        page: pageMeta.value ? pageMeta.value.page + 1 : 1,
      });
      games.value = games.value.concat(gamesResponse.data);
      pageMeta.value = gamesResponse.meta;
    } catch {
      console.error('Games loading failed.');
    }
  };

  const loadMore = ref();
  const { initObserver } = useProjectMethods();
  const observerLoadMore = ref();

  const initGroupGames = async (): Promise<void> => {
    try {
      const gamesResponse = await getFilteredGames(defaultRequestParams);
      if (!gamesResponse.data.length) {
        showBlock.value = false;
        return;
      }

      if (scrollContainer.value) {
        scrollContainer.value.scrollTo({ left: 0 });
      }

      games.value = gamesResponse.data;
      pageMeta.value = gamesResponse.meta;
    } catch {
      showBlock.value = false;
      games.value = [];
      pageMeta.value = undefined;
    }
  };

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  watch(isLoggedIn, async newValue => {
    if (newValue) await initGroupGames();
  });

  const showBlock = ref<boolean>(true);
  onMounted(async () => {
    await initGroupGames();
    if (!games.value.length) return;
    await nextTick();

    if (props.showArrows) {
      scrollHandler();
      showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
    }

    observerLoadMore.value = initObserver({
      settings: { root: scrollContainer.value, rootMargin: '90%', threshold: 0 },
    });
    if (loadMore.value) observerLoadMore.value.observe(loadMore.value);
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

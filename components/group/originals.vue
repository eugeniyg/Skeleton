<template>
  <div class="group-originals" v-if="isShow">
    <atomic-icon :id="globalComponentsContent?.originals?.icon"/>

    <h2 class="title">
      {{ globalComponentsContent?.originals?.label }}
    </h2>

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
        <card-original
          v-for="(game, gameIndex) in games"
          :key="gameIndex"
          v-bind="game"
          :is-wide="gameIndex === 0"
        />
      </template>

      <template v-else>
        <div v-for="n in 9" :key="n" class="card-base"/>
      </template>

      <div class="load-more" ref="loadMore" @inview="moreGames" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame, IPaginationMeta } from '@skeleton/core/types';
  import { storeToRefs } from "pinia";

  const props = defineProps({
    showArrows: {
      type: Boolean,
      default: true,
    },
  });

  const globalStore = useGlobalStore();
  const { globalComponentsContent } = globalStore;
  const { headerCountry } = storeToRefs(globalStore);

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
    const { offsetWidth, scrollWidth, scrollLeft } = scrollContainer.value;
    const widthToEnd = scrollWidth - (scrollLeft + offsetWidth);
    const scrollLeftValue = widthToEnd < offsetWidth ? widthToEnd : offsetWidth;
    const scrollRightValue = scrollLeft < offsetWidth ? scrollLeft : offsetWidth;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? scrollLeftValue : -scrollRightValue,
      behavior: 'smooth',
    });
  };

  const formatIdentity = (list: { identity: string }[]) => list?.map((item: { identity: string }):string => item.identity);
  const defaultRequestParams = {
    identity: formatIdentity(globalComponentsContent?.originals?.items || []),
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
  const loadMoreObserver = ref();

  const emit = defineEmits(['initialLoad']);

  const isShow = computed(() => {
    return globalComponentsContent?.originals?.items?.length && globalComponentsContent?.originals?.display
  })

  onMounted(async () => {
    if (isShow.value) {
      loadMoreObserver.value = initObserver({
        settings: { root: scrollContainer.value, rootMargin: '90%', threshold: 0 },
      });
      loadMoreObserver.value.observe(loadMore.value);

      try {
        const gamesResponse = await getFilteredGames(defaultRequestParams);
        games.value = gamesResponse.data;
        pageMeta.value = gamesResponse.meta;
      } catch {
        games.value = [];
        pageMeta.value = undefined;
      }

      await nextTick();
      emit('initialLoad');

      if (props.showArrows) {
        scrollHandler();
        showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
      }
    }
  });

  onBeforeUnmount(() => {
    if (loadMore.value && loadMoreObserver.value) {
      loadMoreObserver.value.unobserve(loadMore.value);
    }
  })
</script>

<style src="~/assets/styles/components/group/originals.scss" lang="scss" />


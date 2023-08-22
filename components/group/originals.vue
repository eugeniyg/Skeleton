<template>
  <div class="group-originals">
    <atomic-icon v-if="cardContent?.icon" :id="cardContent?.icon"/>

    <h2 class="title">
      {{ cardContent?.label }}
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

      <div class="load-more" ref="loadMore"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    GameInterface, PaginationMetaInterface,
  } from '@platform/frontend-core/dist/module';

  const props = defineProps({
    showArrows: {
      type: Boolean,
      default: true,
    },
  });

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(true);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const games = ref<GameInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();
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

  const moreGames = async (): Promise<void> => {
    if (pageMeta.value?.page === pageMeta.value?.totalPages) return;

    const gamesResponse = await getFilteredGames({
      identity: formatIdentity(cardContent.value.items),
      page: pageMeta.value ? pageMeta.value.page + 1 : 1,
      perPage: 18,
    });
    games.value = games.value.concat(gamesResponse.data);
    pageMeta.value = gamesResponse.meta;
  };

  const loadMore = ref();
  const { initObserver } = useCoreMethods();

  const emit = defineEmits(['initialLoad']);

  const cardContent = computed(() => getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'originals'))

  const formatIdentity = (list: { identity: string }[]) => list?.map((item: { identity: string }):string => item.identity);

  onMounted(async () => {
    initObserver(loadMore.value, {
      onInView: moreGames,
      settings: { root: scrollContainer.value, rootMargin: '90%', threshold: 0 },
    });

    const gamesResponse = await getFilteredGames({
      identity: formatIdentity(cardContent.value.items),
      perPage: 18
    });
    games.value = gamesResponse.data;
    pageMeta.value = gamesResponse.meta;
    await nextTick();
    emit('initialLoad');

    if (props.showArrows) {
      scrollHandler();
      showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
    }
  });
</script>

<style src="~/assets/styles/components/group/originals.scss" lang="scss" />


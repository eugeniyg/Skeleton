<template>
  <div class="group-aero">

    <atomic-icon v-if="titleIcon" :id="titleIcon"/>

    <h2 class="group-aero__title">
      {{ globalComponentsContent?.aeroGroup?.label }}
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

    <div class="group-aero__wrapper">
      <picture class="group-aero__bg">
        <source :media="'(max-width: 768px)'" :srcset="createSrcSet(globalComponentsContent?.aeroGroup?.images.mobile.backgroundImage)" />
        <source :media="'(min-width: 769px)'" :srcset="createSrcSet(globalComponentsContent?.aeroGroup?.images.desktop.backgroundImage)" />
        <atomic-image class="group-aero__bg-img" :src="globalComponentsContent?.aeroGroup?.images.mobile.backgroundImage" />
      </picture>


      <div class="group-aero__game">
        <atomic-picture :src="globalComponentsContent?.aeroGroup?.game?.image"/>

        <div class="group-aero__game-title">
          <span>{{ globalComponentsContent?.aeroGroup?.game?.title }}</span>
          <button-favorite
            v-if="isLoggedIn && globalComponentsContent?.aeroGroup?.game?.identity"
            :gameId="globalComponentsContent?.aeroGroup?.game?.identity"
          />
        </div>
        <div class="group-aero__game-provider">{{ globalComponentsContent?.aeroGroup?.game?.provider }}</div>

        <div class="group-aero__game-actions">
          <button-base
            type="primary"
            size="sm"
            :url="playButtonUrl"
          >
            {{ globalComponentsContent?.aeroGroup?.game?.playButton?.label }}
          </button-base>

          <button-base
            type="secondary"
            size="sm"
            :url="demoButtonUrl"
          >
            {{ globalComponentsContent?.aeroGroup?.game?.demoButton?.label }}
          </button-base>
        </div>
      </div>

      <div
        ref="scrollContainer"
        class="group-aero__games"
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
          <div v-for="n in 9" :key="n" class="card-base"/>
        </template>

        <div class="load-more" ref="loadMore"/>
      </div>

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
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent, gameCategoriesObj } = globalStore;
  const { headerCountry } = storeToRefs(globalStore);
  const { getContent, createSrcSet } = useProjectMethods();
  const titleIcon = gameCategoriesObj[props.category.identity]?.icon;

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(true);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const games = ref<IGame[]>([]);
  const pageMeta = ref<IPaginationMeta>();
  const { getFilteredGames } = useCoreGamesApi();
  const { localizePath } = useProjectMethods();

  const playButtonUrl = computed(() => {
    return localizePath(globalComponentsContent?.aeroGroup?.game?.playButton?.url || '');
  });

  const demoButtonUrl = computed(() => {
    return localizePath(globalComponentsContent?.aeroGroup?.game?.demoButton?.url || '');
  })

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

  const loadMore = ref(null);
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

  const openGames = (): void => {
    const router = useRouter();
    router.push(localizePath(`/games?category=${props.category.identity}`));
  };
</script>


<style src="~/assets/styles/components/group/aero.scss" lang="scss" />


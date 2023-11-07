<template>
  <div class="group-aero">

    <atomic-icon v-if="titleIcon" :id="titleIcon"/>

    <h2 class="group-aero__title">
      {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'label') }}
    </h2>

    <button-base
      v-if="props.showAllBtn"
      class="btn-show-all"
      type="ghost"
      size="sm"
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
        <source :media="'(max-width: 768px)'" :srcset="createSrcSet(mobileLayoutBackground)" />
        <source :media="'(min-width: 769px)'" :srcset="createSrcSet(desktopLayoutBackground)" />
        <atomic-image class="group-aero__bg-img" :src="mobileLayoutBackground" />
      </picture>


      <div class="group-aero__game">
        <atomic-picture :src="getContent(props.currentLocaleContent, props.defaultLocaleContent, 'game.image')"/>

        <div class="group-aero__game-title">
          <span>{{ gameInfo?.name }}</span>
          <button-favorite
            v-if="isLoggedIn"
            :gameId="gameInfo?.id"
          />
        </div>
        <div class="group-aero__game-provider">{{ gameInfo?.provider?.name }}</div>

        <div class="group-aero__game-actions">
          <button-base
            type="primary"
            size="sm"
            @click="openGame(true)"
          >
            {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'game.playButtonLabel') }}
          </button-base>

          <button-base
            type="secondary"
            size="sm"
            @click="openGame(false)"
            v-if="gameInfo?.isDemoMode"
          >
            {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'game.demoButtonLabel') }}
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
            :gameInfo="game"
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
  import type { IGame, IPaginationMeta } from '@skeleton/core/types';
  import { storeToRefs } from "pinia";

  const props = defineProps({
    currentLocaleContent: {
      type: Object,
      required: false
    },
    defaultLocaleContent: {
      type: Object,
      required: false
    },
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
  const { showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent, gameCategoriesObj } = globalStore;
  const { headerCountry } = storeToRefs(globalStore);
  const { getContent, createSrcSet } = useProjectMethods();
  const titleIcon = gameCategoriesObj[props.category.identity]?.icon;
  const router = useRouter();

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(true);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const games = ref<IGame[]>([]);
  const pageMeta = ref<IPaginationMeta>();
  const { getFilteredGames } = useCoreGamesApi();
  const { localizePath } = useProjectMethods();
  const { getGamesInfo } = useCoreGamesApi();

  const gameInfo = ref<IGame>();

  const mobileLayoutBackground = computed(() => {
    return getContent(props.currentLocaleContent, props.defaultLocaleContent, 'images.mobile.backgroundImage')
  });

  const desktopLayoutBackground = computed(() => {
    return getContent(props.currentLocaleContent, props.defaultLocaleContent, 'images.desktop.backgroundImage')
  });

  const gameIdentity = getContent(props.currentLocaleContent, props.defaultLocaleContent, 'game.identity');

  try {
    gameInfo.value = await getGamesInfo(gameIdentity);
  } catch {
    console.error('Something went wrong with game info fetching!');
  }

  const openGame = (isReal: boolean): void => {
    if (!isReal) {
      router.push(localizePath(`/games/${gameIdentity}`));
    } else if (!isLoggedIn.value) {
      showModal('register');
    } else {
      router.push(localizePath(`/games/${gameIdentity}?real=true`));
    }
  };

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


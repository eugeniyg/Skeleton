<template>
  <div v-if="showBlock" class="group-aero">
    <atomic-icon v-if="titleIcon" :id="titleIcon" />

    <h2 class="group-aero__title">
      {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'label') }}
    </h2>

    <button-base v-if="props.showAllBtn" class="btn-show-all" type="ghost" size="sm" @click="openGames">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.moreButton') }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prev-disabled="prevDisabled"
      :next-disabled="nextDisabled"
      @click-action="clickAction"
    />

    <div class="group-aero__wrapper">
      <picture class="group-aero__bg">
        <source :media="'(max-width: 768px)'" :srcset="createSrcSet(mobileLayoutBackground)" />
        <source :media="'(min-width: 769px)'" :srcset="createSrcSet(desktopLayoutBackground)" />
        <atomic-image class="group-aero__bg-img" :src="mobileLayoutBackground" />
      </picture>

      <Skeletor v-if="gameInfoLoading" class="group-aero__game" as="div" />

      <div v-else-if="gameInfo" class="group-aero__game">
        <atomic-picture :src="getContent(props.currentLocaleContent, props.defaultLocaleContent, 'game.image')" />

        <div class="group-aero__game-title">
          <span>{{ gameInfo?.name }}</span>
          <client-only>
            <button-favorite v-if="isLoggedIn" :game-id="gameInfo?.id" />
          </client-only>
        </div>
        <div class="group-aero__game-provider">{{ gameInfo?.provider?.name }}</div>

        <div class="group-aero__game-actions" :class="{ 'has-demo-mode': gameInfo?.isDemoMode }">
          <button-base type="primary" size="sm" @click="openGame(true)">
            {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'game.playButtonLabel') }}
          </button-base>

          <button-base v-if="gameInfo?.isDemoMode" type="secondary" size="sm" @click="openGame(false)">
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
          <card-base v-for="(game, gameIndex) in games" :key="gameIndex" :game-info="game" />
        </template>

        <template v-else>
          <Skeletor v-for="n in 9" :key="n" class="card-base" as="div" />
        </template>

        <div ref="loadMore" class="load-more" @inview="moreGames" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame, IPaginationMeta } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';
  import { Skeletor } from 'vue-skeletor';
  import type { IAeroGroupComponent, ICategory } from '~/types';

  const props = defineProps<{
    currentLocaleContent: Maybe<IAeroGroupComponent>;
    defaultLocaleContent: Maybe<IAeroGroupComponent>;
    category: ICategory;
    showAllBtn?: boolean;
    showArrows?: boolean;
  }>();

  const globalStore = useGlobalStore();
  const profileStore = useProfileStore();
  const { openModal } = useModalStore();
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
    return getContent(props.currentLocaleContent, props.defaultLocaleContent, 'images.mobile.backgroundImage');
  });

  const desktopLayoutBackground = computed(() => {
    return getContent(props.currentLocaleContent, props.defaultLocaleContent, 'images.desktop.backgroundImage');
  });

  const gameIdentity = getContent(props.currentLocaleContent, props.defaultLocaleContent, 'game.identity');

  const gameInfoLoading = ref(false);
  const getGameInfo = async (): Promise<void> => {
    if (!gameIdentity) return;

    gameInfoLoading.value = true;
    try {
      gameInfo.value = await getGamesInfo(gameIdentity);
    } catch {
      console.error('Something went wrong with game info fetching!');
    }
    gameInfoLoading.value = false;
  };

  const openGame = (isReal: boolean): void => {
    if (!isReal) {
      router.push(localizePath(`/games/${gameIdentity}`));
    } else if (!isLoggedIn.value) {
      openModal('sign-up');
    } else {
      router.push(localizePath(`/games/${gameIdentity}?real=true`));
    }
  };

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

  const loadMore = ref(null);
  const { initObserver } = useProjectMethods();
  const loadMoreObserver = ref();

  const emit = defineEmits(['initialLoad']);
  const showBlock = ref<boolean>(true);
  onMounted(async () => {
    loadMoreObserver.value = initObserver({
      settings: { root: scrollContainer.value, rootMargin: '90%', threshold: 0 },
    });
    loadMoreObserver.value.observe(loadMore.value);

    const [gamesResponse] = await Promise.all([getFilteredGames(defaultRequestParams), getGameInfo()]);
    if (!gamesResponse.data.length || !gameInfo.value) return (showBlock.value = false);
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
    router.push(localizePath(`/categories/${props.category.identity}`));
  };

  onBeforeUnmount(() => {
    if (loadMore.value && loadMoreObserver.value) {
      loadMoreObserver.value.unobserve(loadMore.value);
    }
  });
</script>

<style src="~/assets/styles/components/group/aero.scss" lang="scss" />

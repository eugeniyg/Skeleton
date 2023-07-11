<template>
  <div class="favorites">
    <div class="favorites__title">{{ favoritesContent?.title || defaultLocaleFavoritesContent?.title }}</div>

    <list-grid
      v-if="showFavorites"
      :items="currentFavoriteList"
      :meta="pageMeta"
      @loadMore="currentPage++"
    />

    <atomic-empty
      v-else
      :title="getContent(favoritesContent, defaultLocaleFavoritesContent, 'empty.title')"
      :subTitle="getContent(favoritesContent, defaultLocaleFavoritesContent, 'empty.description')"
      :image="getContent(favoritesContent, defaultLocaleFavoritesContent, 'empty.image')"
    />

    <group-games
      v-if="!showFavorites && recommendedCategory"
      :category="recommendedCategory"
      showArrows
      subTitle
    />

    <atomic-seo-text v-if="favoritesContent?.seo?.text" v-bind="favoritesContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { FavoritesPageInterface } from '@skeleton/types';

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const {
    setPageSeo,
    findLocalesContentData,
    getContent,
  } = useProjectMethods();

  const favoritesContentRequest = await useAsyncData('favoritesContent', () => queryContent('page-controls')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'favoritesPage']).find());
  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(favoritesContentRequest.data.value);
  const favoritesContent: Maybe<FavoritesPageInterface> = currentLocaleData?.favoritesPage;
  const defaultLocaleFavoritesContent: Maybe<FavoritesPageInterface> = defaultLocaleData?.favoritesPage;
  setPageSeo(favoritesContent?.seo);

  const gameStore = useGamesStore();
  const profileStore = useProfileStore();
  const { favoriteGames } = storeToRefs(gameStore);
  const { isLoggedIn } = storeToRefs(profileStore);
  const currentPage = ref<number>(1);
  const currentFavoriteList = computed(() => favoriteGames.value.slice(0, currentPage.value * 18));

  const pageMeta = computed(() => ({
    page: currentPage.value,
    perPage: 18,
    totalPages: Math.ceil(favoriteGames.value.length / 18),
  }));

  const { currentLocationCollections } = useGamesStore();
  const recommendedCategory = currentLocationCollections.find((collection) => collection.identity === 'recommended');
  const showFavorites = computed(() => favoriteGames.value?.length && isLoggedIn.value);
</script>

<style src="~/assets/styles/pages/favorites.scss" lang="scss" />


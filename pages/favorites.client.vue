<template>
  <div class="favorites">
    <div class="favorites__title">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
    </div>

    <list-grid v-if="favoriteGames?.length" :items="currentFavoriteList" :meta="pageMeta" @load-more="currentPage++" />

    <atomic-empty
      v-else
      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
      :sub-title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
      :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"
    />

    <group-games
      v-if="!favoriteGames?.length && recommendedCategory"
      :category="recommendedCategory"
      show-arrows
      sub-title
    />
  </div>
</template>

<script setup lang="ts">
  import type { IFavoritesPage } from '~/types';

  const contentParams = {
    contentKey: 'favoritesPageContent',
    contentCollection: 'pages',
    contentSource: 'favorites',
    isPage: true,
  };
  const { getContentData } = useContentLogic<IFavoritesPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  const gameStore = useGamesStore();
  const { favoriteGames, collectionsByCountry } = storeToRefs(gameStore);
  const currentPage = ref<number>(1);
  const currentFavoriteList = computed(() => favoriteGames.value.slice(0, currentPage.value * 18));

  const pageMeta = computed(() => ({
    page: currentPage.value,
    perPage: 18,
    totalPages: Math.ceil(favoriteGames.value.length / 18),
  }));

  const recommendedCategory = collectionsByCountry.value?.find(collection => collection.identity === 'recommended');
</script>

<style src="~/assets/styles/pages/favorites.scss" lang="scss" />

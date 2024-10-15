<template>
  <div class="favorites">
    <div class="favorites__title">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
    </div>

    <list-grid
      v-if="favoriteGames?.length"
      :items="currentFavoriteList"
      :meta="pageMeta"
      @loadMore="currentPage++"
    />

    <atomic-empty
      v-else
      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
      :subTitle="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
      :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"
    />

    <group-games
      v-if="!favoriteGames?.length && recommendedCategory"
      :category="recommendedCategory"
      showArrows
      subTitle
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type {IFavoritesPage} from '~/types';

  const { getContent } = useProjectMethods();

  const contentParams = {
    contentKey: 'favoritesPageContent',
    contentRoute: ['pages', 'favorites'],
    isPage: true
  };
  const { getContentData } = useNewContentLogic<IFavoritesPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(contentParams.contentKey, () => getContentData());

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  const currentPage = ref<number>(1);
  const currentFavoriteList = computed(() => favoriteGames.value.slice(0, currentPage.value * 18));

  const pageMeta = computed(() => ({
    page: currentPage.value,
    perPage: 18,
    totalPages: Math.ceil(favoriteGames.value.length / 18),
  }));

  const { getCollectionsList } = gameStore;
  const { data: gameCollections } = await useLazyAsyncData(() => getCollectionsList(), { server: false });
  const recommendedCategory = computed(() => gameCollections.value?.find((collection) => collection.identity === 'recommended'));
</script>

<style src="~/assets/styles/pages/favorites.scss" lang="scss" />


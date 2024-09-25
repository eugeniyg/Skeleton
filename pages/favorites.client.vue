<template>
  <div class="favorites">
    <div class="favorites__title">
      {{ content?.currentLocaleData?.title || content?.defaultLocaleData?.title }}
    </div>

    <list-grid
      v-if="favoriteGames?.length"
      :items="currentFavoriteList"
      :meta="pageMeta"
      @loadMore="currentPage++"
    />

    <atomic-empty
      v-else
      :title="getContent(content?.currentLocaleData, content?.defaultLocaleData, 'empty.title')"
      :subTitle="getContent(content?.currentLocaleData, content?.defaultLocaleData, 'empty.description')"
      :image="getContent(content?.currentLocaleData, content?.defaultLocaleData, 'empty.image')"
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
  import type { IFavoritesPage } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const {
    setPageMeta,
    getLocalesContentData,
    getContent,
  } = useProjectMethods();

  interface IPageContent {
    currentLocaleData: Maybe<IFavoritesPage>;
    defaultLocaleData: Maybe<IFavoritesPage>;
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('favoritesPageContent');
    if (data.value) return data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'favorites').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : queryContent(defaultLocale.value?.code as string, 'pages', 'favorites').findOne()
    ]);

    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('favoritesPageContent', () => getPageContent());

  watch(content, () => {
    if (content.value) setPageMeta(content.value?.currentLocaleData?.pageMeta);
  }, { immediate: true })

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


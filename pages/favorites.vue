<template>
  <div class="favorites">
    <div class="favorites__title">
      {{ favoritesContent?.title || defaultLocaleFavoritesContent?.title }}
    </div>

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
  import type { IFavoritesPage } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const {
    setPageSeo,
    getLocalesContentData,
    getContent,
  } = useProjectMethods();

  const favoritesContent = ref<Maybe<IFavoritesPage>>();
  const defaultLocaleFavoritesContent = ref<Maybe<IFavoritesPage>>();

  interface IPageContent {
    currentLocaleData: Maybe<IFavoritesPage>;
    defaultLocaleData: Maybe<IFavoritesPage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    favoritesContent.value = contentData?.currentLocaleData;
    defaultLocaleFavoritesContent.value = contentData?.defaultLocaleData;
    setPageSeo(favoritesContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('favoritesPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'favorites').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'favorites').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('favoritesPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

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


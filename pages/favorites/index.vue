<template>
  <div class="favorites">
    <div class="favorites__title">{{ favoritesContent?.title }}</div>

    <client-only>
      <list-grid
        v-if="showFavorites"
        :items="currentFavoriteList"
        :meta="pageMeta"
        @loadMore="currentPage++"
      />

      <atomic-empty
        v-else
        :title="favoritesContent?.empty.title"
        :subTitle="favoritesContent?.empty.description"
        :image="favoritesContent?.empty.image"
      />

      <group-games
        v-if="!showFavorites"
        :category="recommendedCategory"
        showArrows
        subTitle
      />
    </client-only>
    <atomic-seo-text v-if="favoritesContent?.seo?.text" v-bind="favoritesContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { FavoritesPageInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const favoritesContentRequest = await useAsyncData('favoritesContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['favoritesPage']).findOne());
  const favoritesContent:FavoritesPageInterface|undefined = favoritesContentRequest.data.value?.favoritesPage;
  const { setPageSeo } = useProjectMethods();
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

  const { gameCollections } = useGamesStore();
  const recommendedCategory = gameCollections.find((collection) => collection.identity === 'recommended');
  const showFavorites = computed(() => favoriteGames.value?.length && isLoggedIn.value);
</script>

<style lang="scss" src="./style.scss" />

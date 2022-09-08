<template>
  <div class="recently-played">
    <div class="recently-played__title">{{ recentlyContent?.title }}</div>

    <client-only>
      <atomic-empty
        v-if="!favoriteGames.length"
        :title="recentlyContent?.empty.title"
        :subTitle="recentlyContent?.empty.description"
        :image="recentlyContent?.empty.image"
      />

      <list-grid
        v-else
        :items="currentFavoriteList"
        :meta="pageMeta"
        @loadMore="currentPage++"
      />

      <group-games
        v-if="!favoriteGames.length"
        :category="popularCategory"
        showArrows
        :subTitle="recentlyContent?.categorySubtitle"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { RecentlyPageInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const recentlyContentRequest = await useAsyncData('recentlyContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['recentlyPage']).findOne());
  const recentlyContent:RecentlyPageInterface|undefined = recentlyContentRequest.data.value?.recentlyPage;

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  const currentPage = ref<number>(1);
  const currentFavoriteList = computed(() => favoriteGames.value.slice(0, currentPage.value * 18));

  const pageMeta = computed(() => ({
    page: currentPage.value,
    perPage: 18,
    totalPages: Math.ceil(favoriteGames.value.length / 18),
  }));

  const { gameCollections } = useGamesStore();
  const popularCategory = gameCollections.find((collection) => collection.identity === 'popular');
</script>

<style lang="scss" src="./style.scss" />

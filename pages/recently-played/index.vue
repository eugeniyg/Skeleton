<template>
  <div class="recently-played">
    <div class="recently-played__title">Recently Played</div>

    <client-only>
      <atomic-empty
        v-if="!favoriteGames.length"
        title="Nothing found"
        subTitle="You haven't played any games yet"
        variant="search-result"
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
        subTitle="The best games for you"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

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

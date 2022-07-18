<template>
  <div class="favorites">
    <div class="favorites__title">Favorite games</div>

    <client-only>
      <list-grid
        v-if="showFavorites"
        :items="currentFavoriteList"
        :meta="pageMeta"
        @loadMore="currentPage++"
      />

      <atomic-empty
        v-else
        title="Nothing found"
        subTitle="You have no favorite games yet"
        variant="search-result"
      />

      <group-games
        v-if="!showFavorites"
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
  const popularCategory = gameCollections.find((collection) => collection.identity === 'popular');
  const showFavorites = computed(() => favoriteGames.value && isLoggedIn.value);
</script>

<style lang="scss" src="./style.scss" />

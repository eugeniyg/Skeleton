<template>
  <div class="recently-played">
    <div class="recently-played__title">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
    </div>

    <atomic-empty
      v-if="!recentlyGames.length && !loadingData"
      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
      :sub-title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
      :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"
    />

    <list-grid v-else :items="recentlyGames" :meta="pageMeta" />

    <group-games
      v-if="!recentlyGames.length && !loadingData && recommendedCategory"
      :category="recommendedCategory"
      show-arrows
      sub-title
    />
  </div>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/api/types';
  import type { IRecentlyPage } from '~/types';
  import { getRecentlyPlayed } from '@skeleton/api/games';

  const globalStore = useGlobalStore();
  const { isMobile, headerCountry } = storeToRefs(globalStore);

  const contentParams = {
    contentKey: 'recentlyPageContent',
    contentCollection: 'pages',
    contentSource: 'recently',
    isPage: true,
  };
  const { getContentData } = useContentLogic<IRecentlyPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(contentParams.contentKey, getContentData);

  const { collectionsByCountry } = useGamesStore();
  const recommendedCategory = collectionsByCountry.find(collection => collection.identity === 'recommended');

  const pageMeta = computed(() => ({
    page: 1,
    perPage: 18,
    totalPages: 1,
  }));

  const recentlyGames = ref<IGame[]>([]);

  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const loadingData = ref<boolean>(true);
  onMounted(async () => {
    try {
      recentlyGames.value = await getRecentlyPlayed({
        perPage: 18,
        platform: isMobile.value ? 1 : 2,
        countryCode: profile.value?.country || headerCountry.value || 'UA',
      });
    } finally {
      loadingData.value = false;
    }
  });
</script>

<style src="~/assets/styles/pages/recently-played.scss" lang="scss" />

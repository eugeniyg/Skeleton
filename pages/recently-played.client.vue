<template>
  <div class="recently-played">
    <div class="recently-played__title">
      {{ getContent(currentLocaleContent, defaultLocaleContent, 'title') }}
    </div>

    <atomic-empty
      v-if="!recentlyGames.length && !loadingData"
      :title="getContent(currentLocaleContent, defaultLocaleContent, 'empty.title')"
      :subTitle="getContent(currentLocaleContent, defaultLocaleContent, 'empty.description')"
      :image="getContent(currentLocaleContent, defaultLocaleContent, 'empty.image')"
    />

    <list-grid
      v-else
      :items="recentlyGames"
      :meta="pageMeta"
    />

    <group-games
      v-if="!recentlyGames.length && !loadingData && recommendedCategory"
      :category="recommendedCategory"
      showArrows
      subTitle
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IGame } from '@skeleton/core/types';
  import type { IRecentlyPage } from '~/types';

  const globalStore = useGlobalStore();
  const { isMobile, headerCountry } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IRecentlyPage>({
    contentKey: 'recentlyPageContent',
    contentRoute: ['pages', 'recently'],
    isPage: true
  });

  const { getCollectionsList } = useGamesStore();
  const { data: gameCollections } = await useLazyAsyncData(() => getCollectionsList(), { server: false });
  const recommendedCategory = computed(() => gameCollections.value?.find((collection) => collection.identity === 'recommended'));

  const pageMeta = computed(() => ({
    page: 1,
    perPage: 18,
    totalPages: 1,
  }));

  const recentlyGames = ref<IGame[]>([]);

  const { getRecentlyPlayed } = useCoreGamesApi();
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


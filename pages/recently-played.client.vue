<template>
  <div class="recently-played">
    <div class="recently-played__title">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
    </div>

    <atomic-empty
      v-if="!recentlyGames.length && !loadingData"
      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
      :subTitle="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
      :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"
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
  import type {IRecentlyPage} from '~/types';

  const globalStore = useGlobalStore();
  const { isMobile, headerCountry } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const contentParams = {
    contentKey: 'recentlyPageContent',
    contentRoute: ['pages', 'recently'],
    isPage: true
  };
  const { getContentData } = useContentLogic<IRecentlyPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

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


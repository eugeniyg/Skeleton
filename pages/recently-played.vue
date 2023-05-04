<template>
  <div class="recently-played">
    <div class="recently-played__title">{{ recentlyContent?.title || defaultLocaleRecentlyContent?.title }}</div>

    <atomic-empty
      v-if="!recentlyGames.length && !loadingData"
      :title="getContent(recentlyContent, defaultLocaleRecentlyContent, 'empty.title')"
      :subTitle="getContent(recentlyContent, defaultLocaleRecentlyContent, 'empty.description')"
      :image="getContent(recentlyContent, defaultLocaleRecentlyContent, 'empty.image')"
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

    <atomic-seo-text v-if="recentlyContent?.seo?.text" v-bind="recentlyContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { onMounted } from '@vue/runtime-core';
  import { GameInterface } from '@platform/frontend-core/dist/module';
  import { RecentlyPageInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { isMobile, headerCountry, contentLocalesArray } = storeToRefs(globalStore);
  const {
    setPageSeo,
    findLocalesContentData,
    getContent,
  } = useProjectMethods();
  const recentlyContentRequest = await useAsyncData('recentlyContent', () => queryContent('page-controls')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'recentlyPage']).find());

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(recentlyContentRequest.data.value);
  const recentlyContent: Maybe<RecentlyPageInterface> = currentLocaleData?.recentlyPage;
  const defaultLocaleRecentlyContent: Maybe<RecentlyPageInterface> = defaultLocaleData?.recentlyPage;
  setPageSeo(recentlyContent?.seo);

  const { currentLocaleCollections } = useGamesStore();
  const recommendedCategory = currentLocaleCollections.find((collection) => collection.identity === 'recommended');
  const pageMeta = computed(() => ({
    page: 1,
    perPage: 18,
    totalPages: 1,
  }));

  const recentlyGames = ref<GameInterface[]>([]);

  const { getRecentlyPlayed } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const loadingData = ref<boolean>(true);
  onMounted(async () => {
    try {
      const recentlyResponse = await getRecentlyPlayed({
        perPage: 18,
        platform: isMobile.value ? 1 : 2,
        countryCode: profile.value?.country || headerCountry.value || 'UA',
      });
      recentlyGames.value = recentlyResponse;
    } finally {
      loadingData.value = false;
    }
  });
</script>

<style lang="scss">
.recently-played {
  display: grid;
  grid-gap: rem(16px);

  &__title {
    @include font($heading-7);
    color: white;
  }
}
</style>

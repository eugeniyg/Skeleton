<template>
  <div class="recently-played">
    <div class="recently-played__title">{{ recentlyContent?.title }}</div>

    <atomic-empty
      v-if="!recentlyGames.length && !loadingData"
      :title="recentlyContent?.empty.title"
      :subTitle="recentlyContent?.empty.description"
      :image="recentlyContent?.empty.image"
    />

    <list-grid
      v-else
      :items="recentlyGames"
      :meta="pageMeta"
    />

    <group-games
      v-if="!recentlyGames.length && !loadingData"
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
  const { currentLocale, isMobile } = storeToRefs(globalStore);
  const recentlyContentRequest = await useAsyncData('recentlyContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['recentlyPage']).findOne());
  const recentlyContent:RecentlyPageInterface|undefined = recentlyContentRequest.data.value?.recentlyPage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(recentlyContent?.seo);

  const { gameCollections } = useGamesStore();
  const recommendedCategory = gameCollections.find((collection) => collection.identity === 'recommended');
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
        countryCode: profile.value?.country,
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

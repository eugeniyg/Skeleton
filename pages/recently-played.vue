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
import {storeToRefs} from 'pinia';
import {onMounted} from '@vue/runtime-core';
import {IGame} from '@skeleton/core/types';
import { IRecentlyPage } from '~/types';

const globalStore = useGlobalStore();
  const { isMobile, headerCountry, currentLocale, defaultLocale } = storeToRefs(globalStore);
  const {
    setPageSeo,
    getLocalesContentData,
    getContent,
  } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleRecentlyPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'recently').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleRecentlyContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'recently').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const recentlyContent: Maybe<IRecentlyPage> = currentLocaleData;
  const defaultLocaleRecentlyContent: Maybe<IRecentlyPage> = defaultLocaleData;
  setPageSeo(recentlyContent?.seo);

  const { currentLocationCollections } = useGamesStore();
  const recommendedCategory = currentLocationCollections.find((collection) => collection.identity === 'recommended');
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


<template>
  <div class="recently-played">
    <div class="recently-played__title">
      {{ recentlyContent?.title || defaultLocaleRecentlyContent?.title }}
    </div>

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
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IGame } from '@skeleton/core/types';
  import type { IRecentlyPage } from '~/types';

  const globalStore = useGlobalStore();
  const { isMobile, headerCountry, currentLocale, defaultLocale } = storeToRefs(globalStore);
  const {
    setPageMeta,
    getLocalesContentData,
    getContent,
  } = useProjectMethods();

  const recentlyContent = ref<Maybe<IRecentlyPage>>();
  const defaultLocaleRecentlyContent = ref<Maybe<IRecentlyPage>>();

  interface IPageContent {
    currentLocaleData: Maybe<IRecentlyPage>;
    defaultLocaleData: Maybe<IRecentlyPage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    recentlyContent.value = contentData?.currentLocaleData;
    defaultLocaleRecentlyContent.value = contentData?.defaultLocaleData;
    setPageMeta(recentlyContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('recentlyPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'recently').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'recently').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data } = await useLazyAsyncData('recentlyPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

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


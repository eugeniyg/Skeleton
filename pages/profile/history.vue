<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ historyContent?.title || defaultLocaleHistoryContent?.title }}</h1>
    </div>

    <tab-history
      v-if="historyTabContent || defaultLocaleHistoryTabContent"
      :content="historyTabContent || defaultLocaleHistoryTabContent"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { HistoryTabInterface, ProfileHistoryInterface } from '@skeleton/types';

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { setPageSeo, findLocalesContentData } = useProjectMethods();

  const [historyContentRequest, historyTabContentRequest] = await Promise.all([
    useAsyncData('historyContent', () => queryContent('profile')
      .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'history']).find()),
    useAsyncData('historyTabContent', () => queryContent('history').find()),
  ]);

  const historyContentData = findLocalesContentData(historyContentRequest.data.value);
  const historyContent: Maybe<ProfileHistoryInterface> = historyContentData.currentLocaleData?.history;
  const defaultLocaleHistoryContent: Maybe<ProfileHistoryInterface> = historyContentData.defaultLocaleData?.history;

  const historyTabContentData = findLocalesContentData(historyTabContentRequest.data.value);
  const historyTabContent: Maybe<HistoryTabInterface> = historyTabContentData.currentLocaleData as HistoryTabInterface;
  const defaultLocaleHistoryTabContent: Maybe<HistoryTabInterface> = historyTabContentData.defaultLocaleData as HistoryTabInterface;
  setPageSeo(historyContent?.seo);
</script>

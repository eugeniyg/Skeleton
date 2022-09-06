<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ historyContent?.title }}</h1>
    </div>

    <tab-history v-if="historyTabContent" :content="historyTabContent"/>
  </div>
</template>

<script setup lang="ts">
  import { HistoryTabInterface, ProfileHistoryInterface } from '~/types';

  const globalStore = useGlobalStore();
  const historyContent = ref<ProfileHistoryInterface|undefined>(undefined);
  const historyTabContent = ref<HistoryTabInterface|undefined>(undefined);
  const historyContentRequest = await useAsyncData('historyContent', () => queryContent(`profile/${globalStore.currentLocale.code}`).only(['history']).findOne());
  const historyTabContentRequest = await useAsyncData('historyTabContent', () => queryContent(`history/${globalStore.currentLocale.code}`).findOne());
  if (historyContentRequest.data.value?.history) historyContent.value = historyContentRequest.data.value.history as ProfileHistoryInterface;
  if (historyTabContentRequest.data.value) historyTabContent.value = historyTabContentRequest.data.value as HistoryTabInterface;
</script>

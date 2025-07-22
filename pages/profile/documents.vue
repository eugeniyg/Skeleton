<template>
  <div class="documents content">
    <div class="header">
      <h1 class="heading">
        {{ currentLocaleContent?.title || defaultLocaleContent?.title }}
      </h1>
    </div>

    <documents-general />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileDocuments } from '~/types';

  const contentParams = {
    contentCollection: 'profile',
    contentSource: 'documents',
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileDocuments>(contentParams);
  const { data: pageContent } = await useLazyAsyncData('profileDocumentsContent', getContentData);
  const currentLocaleContent = computed(() => pageContent.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => pageContent.value?.defaultLocaleData);

  provide('documentsContent', currentLocaleContent);
  provide('defaultLocaleDocumentsContent', defaultLocaleContent);
</script>

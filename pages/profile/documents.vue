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
  import type {IProfileDocuments} from '~/types';

  const contentParams = {
    contentKey: 'profileDocumentsContent',
    contentRoute: ['profile', 'documents'],
    isPage: true
  };
  const { getContentData } = useNewContentLogic<IProfileDocuments>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(contentParams.contentKey, () => getContentData());
  const currentLocaleContent = computed(() => pageContent.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => pageContent.value?.defaultLocaleData);

  provide('documentsContent', currentLocaleContent);
  provide('defaultLocaleDocumentsContent', defaultLocaleContent);
</script>

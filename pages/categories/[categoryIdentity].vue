<template>
  <div>
    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IGamesPage } from '~/types';
  const emit = defineEmits(['pageMounted']);

  const contentParams = {
    contentKey: 'gamesPageContent',
    contentRoute: ['pages', 'games'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IGamesPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  onMounted(() => {
    emit('pageMounted');
  });
</script>

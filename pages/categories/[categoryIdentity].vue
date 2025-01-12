<template>
  <div>
    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ICategoryPage } from '~/types';
  const emit = defineEmits(['pageMounted']);

  const contentParams = {
    contentKey: 'categoryPageContent',
    contentRoute: ['pages', 'category'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<ICategoryPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  onMounted(() => {
    emit('pageMounted');
  });
</script>

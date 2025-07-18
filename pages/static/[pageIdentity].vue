<template>
  <div class="static-page">
    <template v-if="pageContent?.currentLocaleData || pageContent?.defaultLocaleData">
      <atomic-text-editor
        :content="pageContent?.currentLocaleData?.content || pageContent?.defaultLocaleData?.content"
      />
      <atomic-seo-text
        v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
        v-bind="pageContent.currentLocaleData?.pageMeta?.seoText"
      />
    </template>

    <not-found v-else-if="status !== 'pending'" />
  </div>
</template>

<script setup lang="ts">
  import type { IStaticPage } from '~/types';

  const route = useRoute();
  const { pageIdentity } = route.params;
  const contentParams = {
    contentKey: `${pageIdentity}-static-content`,
    contentRoute: ['static'],
    isPage: true,
    where: ['pageIdentity', '=', pageIdentity],
  };
  const { getContentData } = useContentLogic<IStaticPage>(contentParams);
  const { status, data: pageContent } = await useLazyAsyncData(getContentData);
</script>

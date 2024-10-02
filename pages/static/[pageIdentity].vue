<template>
  <div class="static-page">
    <template v-if="currentLocaleContent || defaultLocaleContent">
      <atomic-text-editor :content="currentLocaleContent?.content || defaultLocaleContent?.content" />
      <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent?.pageMeta?.seoText" />
    </template>

    <not-found v-else-if="status !== 'pending'" />
  </div>
</template>

<script setup lang="ts">
  import type { IStaticPage } from '~/types';

  const route = useRoute();
  const { pageIdentity } = route.params;

  const { currentLocaleContent, defaultLocaleContent, status } = await useContentLogic<IStaticPage>({
    contentKey: `${pageIdentity}-static-content`,
    contentRoute: ['static'],
    isPage: true,
    where: { pageIdentity }
  });
</script>

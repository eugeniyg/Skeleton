<template>
  <div>
    <atomic-text-editor :content="pageContent?.content || defaultLocalePageContent?.content" />
    <atomic-seo-text v-if="pageContent?.seo?.text" v-bind="pageContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { StaticPageInterface } from '@skeleton/types';

  const pageContent = ref<StaticPageInterface|undefined>(undefined);
  const defaultLocalePageContent = ref<StaticPageInterface|undefined>(undefined);
  const route = useRoute();
  const { pageUrl } = route.params;
  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const {
    setPageSeo,
    findLocalesContentData,
  } = useProjectMethods();
  const pageContentRequest = await useAsyncData('staticPageContent', () => queryContent('static')
    .where({ locale: { $in: contentLocalesArray.value }, pageUrl }).find());

  if (pageContentRequest.error.value || !pageContentRequest.data.value?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  } else {
    const { currentLocaleData, defaultLocaleData } = findLocalesContentData(pageContentRequest.data.value);
    pageContent.value = currentLocaleData as StaticPageInterface;
    defaultLocalePageContent.value = defaultLocaleData as StaticPageInterface;
  }

  setPageSeo(pageContent.value?.seo);
</script>

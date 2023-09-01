<template>
  <div>
    <atomic-text-editor :content="pageContent?.content" />
    <atomic-seo-text v-if="pageContent?.seo?.text" v-bind="pageContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IStaticPage } from '~/types';

  const pageContent = ref<IStaticPage|undefined>(undefined);
  const route = useRoute();
  const { pageUrl } = route.params;
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const { setPageSeo } = useProjectMethods();

  const { data: { value: staticPageContent } }: { data: { value: IStaticPage }} = await useAsyncData(`${pageUrl}-static`,
    () => queryContent(currentLocale.value?.code as string, 'static', pageUrl as string).findOne());

  if (staticPageContent) {
    pageContent.value = staticPageContent;
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  }
  setPageSeo(pageContent.value?.seo);
</script>

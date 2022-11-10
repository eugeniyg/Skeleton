<template>
  <div>
    <atomic-text-editor :content="pageContent?.content" />
    <atomic-seo-text v-if="pageContent?.seo?.text" v-bind="pageContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { StaticPageInterface } from '~/types';

  const pageContent = ref<StaticPageInterface|undefined>(undefined);
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const route = useRoute();
  const { pageUrl } = route.params;
  const pageContentRequest = await useAsyncData('pageContent', () => queryContent(`static/${currentLocale.value?.code}-${pageUrl}`).findOne(), { initialCache: false });
  if (pageContentRequest.error.value) throw pageContentRequest.error.value;
  else pageContent.value = pageContentRequest.data.value as StaticPageInterface;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(pageContent.value?.seo);
</script>

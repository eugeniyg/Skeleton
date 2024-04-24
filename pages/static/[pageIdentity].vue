<template>
  <div class="static-page">
    <template v-if="currentLocaleStaticContent || defaultLocaleStaticContent">
      <atomic-text-editor :content="currentLocaleStaticContent?.content || defaultLocaleStaticContent?.content" />
      <atomic-seo-text v-if="currentLocaleStaticContent?.pageMeta?.seoText" v-bind="currentLocaleStaticContent?.pageMeta?.seoText" />
    </template>

    <not-found v-else-if="!pending" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IStaticPage } from '~/types';

  const route = useRoute();
  const { pageIdentity } = route.params;
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageMeta, getLocalesContentData } = useProjectMethods();

  interface IPageContent {
    currentLocaleData: Maybe<IStaticPage>;
    defaultLocaleData: Maybe<IStaticPage>;
  }

  const currentLocaleStaticContent = ref<Maybe<IStaticPage>>();
  const defaultLocaleStaticContent = ref<Maybe<IStaticPage>>();

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    currentLocaleStaticContent.value = contentData?.currentLocaleData;
    defaultLocaleStaticContent.value = contentData?.defaultLocaleData;
    setPageMeta(currentLocaleStaticContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData(`${pageIdentity}-static-content`);
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'static').where({ pageIdentity }).findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'static').where({ pageIdentity }).findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData(`${pageIdentity}-static-content`, () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })
</script>

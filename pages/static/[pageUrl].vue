<template>
  <div class="static-page">
    <template v-if="currentLocaleStaticContent || defaultLocaleStaticContent">
      <atomic-text-editor :content="currentLocaleStaticContent?.content || defaultLocaleStaticContent?.content" />
      <atomic-seo-text v-if="currentLocaleStaticContent?.seo?.text" v-bind="currentLocaleStaticContent?.seo?.text" />
    </template>

    <not-found v-else-if="!pending" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IStaticPage } from '~/types';

  const route = useRoute();
  const { pageUrl } = route.params;
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageSeo, getLocalesContentData } = useProjectMethods();

  interface IPageContent {
    currentLocaleData: Maybe<IStaticPage>;
    defaultLocaleData: Maybe<IStaticPage>;
  }

  const currentLocaleStaticContent = ref<Maybe<IStaticPage>>();
  const defaultLocaleStaticContent = ref<Maybe<IStaticPage>>();

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    currentLocaleStaticContent.value = contentData?.currentLocaleData;
    defaultLocaleStaticContent.value = contentData?.defaultLocaleData;
    setPageSeo(currentLocaleStaticContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData(`${pageUrl}-static-content`);
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'static', pageUrl as string).findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'static', pageUrl as string).findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData(`${pageUrl}-static-content`, () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })
</script>

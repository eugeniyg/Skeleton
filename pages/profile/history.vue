<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ historyContent?.title || defaultLocaleHistoryContent?.title }}</h1>
    </div>

    <tab-history
      v-if="historyTabContent || defaultLocaleHistoryTabContent"
      :content="historyTabContent || defaultLocaleHistoryTabContent"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IHistory, IProfileHistory } from '~/types';
  import camelCase from "lodash/camelCase";

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageSeo, getLocalesContentData } = useProjectMethods();

  const historyContent = ref<Maybe<IProfileHistory>>();
  const defaultLocaleHistoryContent = ref<Maybe<IProfileHistory>>();
  const currentLocaleTabsContent = ref();
  const defaultLocaleTabsContent = ref();
  const historyTabContent = ref<Maybe<IHistory>>();
  const defaultLocaleHistoryTabContent = ref<Maybe<IHistory>>();

  interface IPageContent {
    currentLocalePageData: Maybe<IProfileHistory>;
    defaultLocalePageData: Maybe<IProfileHistory>;
    currentLocaleTabData: any;
    defaultLocaleTabData: any;
  }

  const setPageContent = ():void => {
    if (currentLocaleTabsContent.value?.length) {
      historyTabContent.value  = currentLocaleTabsContent.value.reduce((finalContentObj:any, currentContent:any) => {
        const splitPath = currentContent._path?.split('/');
        if (!splitPath) return finalContentObj;

        const contentName = camelCase(splitPath[3]);
        return { ...finalContentObj, [contentName]: currentContent }
      }, {})
    }

    if (defaultLocaleTabsContent.value?.length) {
      defaultLocaleHistoryTabContent.value  = defaultLocaleTabsContent.value.reduce((finalContentObj:any, currentContent:any) => {
        const splitPath = currentContent._path?.split('/');
        if (!splitPath) return finalContentObj;

        const contentName = camelCase(splitPath[3]);
        return { ...finalContentObj, [contentName]: currentContent }
      }, {})
    }
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    historyContent.value = contentData?.currentLocalePageData;
    defaultLocaleHistoryContent.value = contentData?.defaultLocalePageData;
    currentLocaleTabsContent.value = contentData?.currentLocaleTabData;
    defaultLocaleTabsContent.value = contentData?.defaultLocaleTabData;
    setPageContent();
    setPageSeo(historyContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('profileHistoryContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [
      currentLocaleContentResponse,
      defaultLocaleContentResponse,
      currentLocaleTabsContentResponse,
      defaultLocaleTabsContentResponse
    ] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'history').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'history').findOne(),
      queryContent(currentLocale.value?.code as string, 'history').find(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'history').find()
    ]);

    const responseHistoryContent =  getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
    const responseHistoryTabContent = getLocalesContentData(currentLocaleTabsContentResponse, defaultLocaleTabsContentResponse);
    return reactive({
      currentLocalePageData: responseHistoryContent.currentLocaleData,
      defaultLocalePageData: responseHistoryContent.defaultLocaleData,
      currentLocaleTabData: responseHistoryTabContent.currentLocaleData,
      defaultLocaleTabData: responseHistoryTabContent.defaultLocaleData
    });
  }

  const { pending, data } = await useLazyAsyncData('profileHistoryContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })
</script>

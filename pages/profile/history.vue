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

  let historyContent: Maybe<IProfileHistory>;
  let defaultLocaleHistoryContent: Maybe<IProfileHistory>;
  let currentLocaleTabsContent;
  let defaultLocaleTabsContent;
  let historyTabContent: Maybe<IHistory>;
  let defaultLocaleHistoryTabContent: Maybe<IHistory>;
  const [
    nuxtCurrentLocaleHistoryData,
    nuxtDefaultLocaleHistoryData,
    nuxtCurrentLocaleTabData,
    nuxtDefaultLocaleTabData
  ] = [
    useNuxtData('currentLocaleProfileHistoryContent'),
    useNuxtData('defaultLocaleProfileHistoryContent'),
    useNuxtData('currentLocaleHistoryContent'),
    useNuxtData('defaultLocaleHistoryContent')
  ]

  if (nuxtCurrentLocaleHistoryData.data.value
    || nuxtDefaultLocaleHistoryData.data.value
    || nuxtCurrentLocaleTabData.data.value
    || nuxtDefaultLocaleTabData.data.value
  ) {
    historyContent = nuxtCurrentLocaleHistoryData.data.value;
    defaultLocaleHistoryContent = nuxtDefaultLocaleHistoryData.data.value;
    currentLocaleTabsContent = nuxtCurrentLocaleTabData.data.value;
    defaultLocaleTabsContent = nuxtDefaultLocaleTabData.data.value;
  } else {
    const [
      currentLocaleContentResponse,
      defaultLocaleContentResponse,
      currentLocaleTabsContentResponse,
      defaultLocaleTabsContentResponse
    ] = await Promise.allSettled([
      useAsyncData('currentLocaleProfileHistoryContent', () => queryContent(currentLocale.value?.code as string, 'profile', 'history').findOne()),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : useAsyncData('defaultLocaleProfileHistoryContent', () => queryContent(defaultLocale.value?.code as string, 'profile', 'history').findOne()),
      useAsyncData('currentLocaleHistoryContent', () => queryContent(currentLocale.value?.code as string, 'history').find()),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : useAsyncData('defaultLocaleHistoryContent', () => queryContent(defaultLocale.value?.code as string, 'history').find())
    ]);

    const responseHistoryContent = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
    historyContent = responseHistoryContent.currentLocaleData;
    defaultLocaleHistoryContent = responseHistoryContent.defaultLocaleData;

    const responseHistoryTabContent = getLocalesContentData(currentLocaleTabsContentResponse, defaultLocaleTabsContentResponse);
    currentLocaleTabsContent = responseHistoryTabContent.currentLocaleData;
    defaultLocaleTabsContent = responseHistoryTabContent.defaultLocaleData;
  }

  if (currentLocaleTabsContent?.length) {
    historyTabContent  = currentLocaleTabsContent.reduce((finalContentObj:any, currentContent:any) => {
      const splitPath = currentContent._path?.split('/');
      if (!splitPath) return finalContentObj;

      const contentName = camelCase(splitPath[3]);
      return { ...finalContentObj, [contentName]: currentContent }
    }, {})
  }

  if (defaultLocaleTabsContent?.length) {
    defaultLocaleHistoryTabContent  = defaultLocaleTabsContent.reduce((finalContentObj:any, currentContent:any) => {
      const splitPath = currentContent._path?.split('/');
      if (!splitPath) return finalContentObj;

      const contentName = camelCase(splitPath[3]);
      return { ...finalContentObj, [contentName]: currentContent }
    }, {})
  }

  setPageSeo(historyContent?.seo);
</script>

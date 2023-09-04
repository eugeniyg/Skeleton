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
  import { IHistory } from '~/types';
  import {camelCase} from "lodash";

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageSeo, getLocalesContentData } = useProjectMethods();

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

  const { currentLocaleData: historyContent, defaultLocaleData: defaultLocaleHistoryContent } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);

  let historyTabContent: IHistory;
  let defaultLocaleHistoryTabContent: IHistory;

  const { currentLocaleData: currentLocaleTabsContent, defaultLocaleData: defaultLocaleTabsContent } = getLocalesContentData(currentLocaleTabsContentResponse, defaultLocaleTabsContentResponse);

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

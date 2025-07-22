<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ pageContent?.currentLocaleData?.title || pageContent?.defaultLocaleData?.title }}</h1>
    </div>

    <tab-history
      v-if="historyTabContent || defaultLocaleHistoryTabContent"
      :content="(historyTabContent || defaultLocaleHistoryTabContent) as IHistory"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IHistory, IProfileHistory } from '~/types';
  import camelCase from 'lodash/camelCase';

  const pageContentParams = {
    contentKey: 'profileHistoryContent',
    contentCollection: 'profile',
    contentSource: 'history',
    isPage: true,
  };
  const { getContentData: getPageContent } = useContentLogic<IProfileHistory>(pageContentParams);
  const { data: pageContent } = await useLazyAsyncData(pageContentParams.contentKey, getPageContent);

  const menuContentParams = {
    contentKey: 'profileHistoryMenuContent',
    contentCollection: 'history',
    findAll: true,
  };
  const { getContentData: getMenuContent } = useContentLogic<any>(menuContentParams);
  const { data: menuContent } = await useLazyAsyncData(menuContentParams.contentKey, getMenuContent);

  const historyTabContent = computed<IHistory | undefined>(() => {
    if (!menuContent.value?.currentLocaleData?.length) return undefined;

    return menuContent.value?.currentLocaleData?.reduce((finalContentObj: any, currentContent: any) => {
      const splitPath = currentContent.stem?.split('/');
      if (!splitPath) return finalContentObj;

      const contentName = camelCase(splitPath[2]);
      return { ...finalContentObj, [contentName]: currentContent };
    }, {});
  });

  const defaultLocaleHistoryTabContent = computed<IHistory | undefined>(() => {
    if (!menuContent.value?.defaultLocaleData?.length) return undefined;

    return menuContent.value?.defaultLocaleData?.reduce((finalContentObj: any, currentContent: any) => {
      const splitPath = currentContent.stem?.split('/');
      if (!splitPath) return finalContentObj;

      const contentName = camelCase(splitPath[2]);
      return { ...finalContentObj, [contentName]: currentContent };
    }, {});
  });
</script>

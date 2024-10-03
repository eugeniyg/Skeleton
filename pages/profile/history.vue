<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ currentLocalePageContent?.title || defaultLocalePageContent?.title }}</h1>
    </div>

    <tab-history
      v-if="historyTabContent || defaultLocaleHistoryTabContent"
      :content="historyTabContent || defaultLocaleHistoryTabContent"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IHistory, IProfileHistory } from '~/types';
  import camelCase from "lodash/camelCase";

  const {
    currentLocaleContent: currentLocalePageContent,
    defaultLocaleContent: defaultLocalePageContent
  } = await useContentLogic<IProfileHistory>({
    contentKey: 'profileHistoryContent',
    contentRoute: ['profile', 'history'],
    isPage: true
  });

  const {
    currentLocaleContent: currentLocaleMenuContent,
    defaultLocaleContent: defaultLocaleMenuContent
  } = await useContentLogic<any>({
    contentKey: 'profileHistoryMenuContent',
    contentRoute: ['history'],
    findAll: true
  });

  const historyTabContent = computed<IHistory|undefined>(() => {
    if (!currentLocaleMenuContent.value?.length) return undefined;

    return currentLocaleMenuContent.value.reduce((finalContentObj:any, currentContent:any) => {
      const splitPath = currentContent._path?.split('/');
      if (!splitPath) return finalContentObj;

      const contentName = camelCase(splitPath[3]);
      return { ...finalContentObj, [contentName]: currentContent }
    }, {})
  });

  const defaultLocaleHistoryTabContent = computed<IHistory|undefined>(() => {
    if (!defaultLocaleMenuContent.value?.length) return undefined;

    return defaultLocaleMenuContent.value.reduce((finalContentObj:any, currentContent:any) => {
      const splitPath = currentContent._path?.split('/');
      if (!splitPath) return finalContentObj;

      const contentName = camelCase(splitPath[3]);
      return { ...finalContentObj, [contentName]: currentContent }
    }, {})

  });
</script>

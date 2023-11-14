<template>
  <div>
    <atomic-text-editor :content="currentLocaleStaticContent?.content || defaultLocaleStaticContent?.content" />
    <atomic-seo-text v-if="currentLocaleStaticContent?.seo?.text" v-bind="currentLocaleStaticContent?.seo?.text" />
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

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData(`${pageUrl}-static-current`, () => queryContent(currentLocale.value?.code as string, 'static', pageUrl as string).findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData(`${pageUrl}-static-default`, () => queryContent(defaultLocale.value?.code as string, 'static', pageUrl as string).findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const currentLocaleStaticContent: IStaticPage = currentLocaleData;
  const defaultLocaleStaticContent: IStaticPage = defaultLocaleData;
  setPageSeo(currentLocaleStaticContent?.seo);
</script>

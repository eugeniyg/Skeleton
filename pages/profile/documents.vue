<template>
  <div class="documents content">
    <div class="header">
      <h1 class="heading">
        {{ documentsContent?.title || defaultLocaleDocumentsContent?.title }}
      </h1>
    </div>

    <profile-documents />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileDocuments } from '~/types';

  const { setPageMeta, getLocalesContentData } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const documentsContent = ref<Maybe<IProfileDocuments>>();
  const defaultLocaleDocumentsContent = ref<Maybe<IProfileDocuments>>();
  provide('documentsContent', documentsContent);
  provide('defaultLocaleDocumentsContent', defaultLocaleDocumentsContent);

  interface IPageContent {
    currentLocaleData: Maybe<IProfileDocuments>;
    defaultLocaleData: Maybe<IProfileDocuments>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    documentsContent.value = contentData?.currentLocaleData;
    defaultLocaleDocumentsContent.value = contentData?.defaultLocaleData;
    setPageMeta(documentsContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('profileDocumentsContent');
    if (data.value) return data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'documents').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'documents').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('profileDocumentsContent', () => getPageContent());

  watch(content, () => {
    if (content.value) setContentData(content.value);
  }, { immediate: true });
</script>

<template>
  <div class="loyalty">
    <loyalty-banner />

    <loyalty-how-it-works />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ILoyaltyPage } from '~/types';

  const globalStore = useGlobalStore();
  const {
    currentLocale,
    defaultLocale
  } = storeToRefs(globalStore);

  const {
    setPageMeta,
    getContent,
    getLocalesContentData,
  } = useProjectMethods();

  const loyaltyContent = ref<Maybe<ILoyaltyPage>>();
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>();
  provide('loyaltyContent', loyaltyContent);
  provide('defaultLocaleLoyaltyContent', defaultLocaleLoyaltyContent);

  interface IPageContent {
    currentLocaleData: Maybe<ILoyaltyPage>;
    defaultLocaleData: Maybe<ILoyaltyPage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    loyaltyContent.value = contentData?.currentLocaleData;
    defaultLocaleLoyaltyContent.value = contentData?.defaultLocaleData;
    setPageMeta(loyaltyContent.value?.pageMeta);
  };

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('loyaltyPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'loyalty').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'loyalty').findOne()
    ]);

    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  };

  const { data } = await useLazyAsyncData('loyaltyPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  });
</script>
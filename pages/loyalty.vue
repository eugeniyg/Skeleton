<template>
  <div class="loyalty">
    <card-loyalty
      v-if="loyaltyContent?.banner || defaultLocaleLoyaltyContent?.banner"
      :content="loyaltyContent?.banner || defaultLocaleLoyaltyContent?.banner"
    />
    
    <loyalty-how-it-works
      v-if="loyaltyContent?.howItWorks || defaultLocaleLoyaltyContent?.howItWorks"
      :content="loyaltyContent?.howItWorks || defaultLocaleLoyaltyContent?.howItWorks"
    />
    
    <loyalty-rewards
      v-if="loyaltyContent?.rewards || defaultLocaleLoyaltyContent?.rewards"
      :content="loyaltyContent?.rewards || defaultLocaleLoyaltyContent?.rewards"
    />
    
    <loyalty-benefits
      v-if="loyaltyContent?.benefits || defaultLocaleLoyaltyContent?.benefits"
      :content="loyaltyContent?.benefits || defaultLocaleLoyaltyContent?.benefits"
    />
    
    <loyalty-faq
      v-if="loyaltyContent?.faq || defaultLocaleLoyaltyContent?.faq"
      :content="loyaltyContent?.faq || defaultLocaleLoyaltyContent?.faq"
    />
    
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
    localizePath,
    getContent,
    getLocalesContentData,
  } = useProjectMethods();
  
  const loyaltyContent = ref<Maybe<ILoyaltyPage>>();
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>();
  
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
      queryContent(currentLocale.value?.code as string, 'pages', 'loyalty')
        .findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'loyalty')
          .findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  };
  
  const {
    pending,
    data
  } = await useLazyAsyncData('homePageContent', () => getPageContent());
  if (data.value) setContentData(data.value);
  
  watch(data, () => {
    setContentData(data.value);
  });

</script>

<template>
  <div class="lottery">
    <lottery-banner/>
    
    <lottery-prizes/>
    
    <lottery-steps/>
    
    <lottery-tickets-types/>
    
    <terms-expander v-if="termsData?.title && termsData?.content" v-bind="termsData" />
    
    <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent.pageMeta.seoText" />
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage } from "~/types";
  
  const contentParams = {
    contentCollection: 'pages',
    contentSource: 'lotteries',
    isPage: true,
  };
  const { getContentData } = useContentLogic<ILotteryPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
  
  const currentLocaleContent = computed(() => pageContent.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => pageContent.value?.defaultLocaleData);
  
  provide('lotteryContent', currentLocaleContent);
  provide('defaultLocaleLotteryContent', defaultLocaleContent);
  
  const termsData = computed<{ title: string; content: string } | undefined>(() => {
    const currentLocaleTerms = getContent(currentLocaleContent.value, defaultLocaleContent.value, 'terms');
    if (currentLocaleTerms?.title && currentLocaleTerms?.content) return currentLocaleTerms;
    return undefined;
  });
</script>
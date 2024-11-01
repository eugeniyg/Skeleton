<template>
  <div class="loyalty">
    <loyalty-banner />

    <loyalty-how-it-works />

    <loyalty-rewards />

    <loyalty-benefits />

    <loyalty-faq />

    <loyalty-terms
      v-if="termsData?.title && termsData?.content"
      v-bind="termsData"
    />

    <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent.pageMeta.seoText" />
  </div>
</template>

<script setup lang="ts">
  import type {ILoyaltyPage} from '~/types';

  const { getContent } = useProjectMethods();
  
  const contentParams = {
    contentKey: 'loyaltyPageContent',
    contentRoute: ['pages', 'loyalty'],
    isPage: true
  };
  const { getContentData } = useContentLogic<ILoyaltyPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(contentParams.contentKey, () => getContentData());
  const currentLocaleContent = computed(() => pageContent.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => pageContent.value?.defaultLocaleData);

  provide('loyaltyContent', currentLocaleContent);
  provide('defaultLocaleLoyaltyContent', defaultLocaleContent);

  const termsData = computed<{title: string; content: string }|undefined>(() => {
    const currentLocaleTerms = getContent(currentLocaleContent.value, defaultLocaleContent.value, 'terms');
    if (currentLocaleTerms?.title && currentLocaleTerms?.content) return currentLocaleTerms;
    return undefined;
  })
</script>
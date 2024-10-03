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
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';

  const { getContent } = useProjectMethods();
  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<ILoyaltyPage>({
    contentKey: 'loyaltyPageContent',
    contentRoute: ['pages', 'loyalty'],
    isPage: true
  });

  provide('loyaltyContent', currentLocaleContent);
  provide('defaultLocaleLoyaltyContent', defaultLocaleContent);

  const termsData = computed<{title: string; content: string }|undefined>(() => {
    const currentLocaleTerms = getContent(currentLocaleContent.value, defaultLocaleContent.value, 'terms');
    if (currentLocaleTerms?.title && currentLocaleTerms?.content) return currentLocaleTerms;
    return undefined;
  })
</script>
<template>
  <div class="loyalty-benefits">
    <div class="loyalty-benefits__title">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'benefits.title') }}
    </div>

    <div class="loyalty-benefits__description">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'benefits.description') }}
    </div>

    <loyalty-benefits-tabs v-if="benefitsTabs.length > 1" :tabs="benefitsTabs" :numbered-list="numberedList" />

    <loyalty-benefits-grid
      v-else-if="benefitsTabs.length && benefitsTabs[0].benefits.length"
      :items="benefitsTabs[0].benefits"
      :numbered-list="numberedList"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';

  const loyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('loyaltyContent'));
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('defaultLocaleLoyaltyContent'));

  const benefitsTabs = computed(() => {
    return getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'benefits.benefitsTabs') || [];
  });

  const numberedList = computed(() => {
    return getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'benefits.numberedList');
  });
</script>

<style src="~/assets/styles/components/loyalty/benefits.scss" lang="scss" />

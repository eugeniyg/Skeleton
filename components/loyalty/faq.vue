<template>
  <div class="loyalty-faq">
    <div class="loyalty-faq__title">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'faq.title') }}
    </div>

    <div class="loyalty-faq__description">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'faq.description') }}
    </div>

    <div v-if="faqItems.length" class="loyalty-faq__items">
      <div class="loyalty-faq__column">
        <expander
          v-for="(item, itemIndex) in firstHalf"
          :key="itemIndex"
          :title="item.question"
          :content="item.answer"
        />
      </div>

      <div class="loyalty-faq__column">
        <expander
          v-for="(item, itemIndex) in secondHalf"
          :key="itemIndex"
          :title="item.question"
          :content="item.answer"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';

  const loyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('loyaltyContent'));
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('defaultLocaleLoyaltyContent'));

  const firstHalf = ref<ILoyaltyPage['faq']['items']>([]);
  const secondHalf = ref<ILoyaltyPage['faq']['items']>([]);

  const faqItems = computed(() => {
    return getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'faq.items') || [];
  });

  watch(
    faqItems,
    newValue => {
      const middleIndex = Math.ceil(faqItems.value.length / 2);
      firstHalf.value = newValue.slice(0, middleIndex);
      secondHalf.value = newValue.slice(middleIndex);
    },
    { immediate: true }
  );
</script>

<style src="~/assets/styles/components/loyalty/faq.scss" lang="scss" />

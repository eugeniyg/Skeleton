<template>
  <div class="referral-faq">
    <div class="referral-faq__title">
      {{ getContent(referralContent, defaultLocaleReferralContent, 'faq.title') }}
    </div>

    <div class="referral-faq__description">
      {{ getContent(referralContent, defaultLocaleReferralContent, 'faq.description') }}
    </div>

    <div v-if="faqItems.length" class="referral-faq__items">
      <div class="referral-faq__column">
        <expander
          v-for="(item, itemIndex) in firstHalf"
          :key="itemIndex"
          :title="item.question"
          :content="item.answer"
        />
      </div>

      <div class="referral-faq__column">
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
  import type { IProfileReferral } from '~/types';
  import { getContent } from '#imports';

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));
  const firstHalf = ref<IProfileReferral['faq']['items']>([]);
  const secondHalf = ref<IProfileReferral['faq']['items']>([]);

  const faqItems = computed(() => {
    return getContent(referralContent.value, defaultLocaleReferralContent.value, 'faq.items') || [];
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

<style src="~/assets/styles/components/referral/faq.scss" lang="scss" />

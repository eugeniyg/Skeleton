<template>
  <div class="referral-how-it-works">
    <div class="referral-how-it-works__title">{{ title }}</div>
    <div class="referral-how-it-works__description">{{ description }}</div>

    <ul v-if="items.length" class="referral-how-it-works__items">
      <li v-for="(item, index) in items" :key="index" class="referral-how-it-works__item">
        <div class="referral-how-it-works__picture-container">
          <atomic-image v-if="itemBgImage" class="referral-how-it-works__picture-bg" :src="itemBgImage" />
          <atomic-picture v-if="item.image" class="referral-how-it-works__picture" :src="item.image" />
        </div>
        <div class="referral-how-it-works__item-icon">{{ index + 1 }}</div>
        <div class="referral-how-it-works__item-title">{{ item.title }}</div>
        <div class="referral-how-it-works__item-description">{{ item.description }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileReferral } from '~/types';

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));
  const { getContent } = useProjectMethods();

  const title = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'howItWorks.title')
  );
  const description = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'howItWorks.description')
  );
  const items = computed(
    () => getContent(referralContent.value, defaultLocaleReferralContent.value, 'howItWorks.items') || []
  );
  const itemBgImage = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'howItWorks.itemBgImg')
  );
</script>

<style src="~/assets/styles/components/referral/how-it-works.scss" lang="scss" />

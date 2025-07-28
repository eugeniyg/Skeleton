<template>
  <div class="referral-unavailable-msg">
    <atomic-picture v-if="image" class="referral-unavailable-msg__icon" :src="image" />
    <div class="referral-unavailable-msg__text">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileReferral } from '~/types';
  import { getContent } from '#imports';

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));

  const image = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.unavailable.image')
  );

  const message = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.unavailable.text')
  );
</script>

<style src="~/assets/styles/components/referral/unavailable-msg.scss" lang="scss" />

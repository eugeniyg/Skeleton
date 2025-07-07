<template>
  <div class="referral-unavailable-msg">
    <atomic-icon id="warning" class="referral-unavailable-msg__icon" size="24" />
    <div class="referral-unavailable-msg__text">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileReferral } from '~/types';

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));
  const { getContent } = useProjectMethods();

  const message = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.unavailableMsg')
  );
</script>

<style src="~/assets/styles/components/referral/unavailable-msg.scss" lang="scss" />

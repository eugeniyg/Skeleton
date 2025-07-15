<template>
  <div class="sumsub-info">
    <profile-info-accordeon
      v-for="(item, index) in infoList"
      :key="index"
      :title="item.title"
      :description="item.description"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileVerification } from '~/types';

  const verificationContent = ref<Maybe<IProfileVerification>>(inject('verificationContent'));
  const defaultLocaleVerificationContent = ref<Maybe<IProfileVerification>>(inject('defaultLocaleVerificationContent'));

  const infoList = computed(() => {
    return getContent(verificationContent.value, defaultLocaleVerificationContent.value, 'sumsub.infoList') || [];
  });
</script>

<style src="~/assets/styles/components/verification/sumsub-info.scss" lang="scss" />

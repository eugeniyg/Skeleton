<template>
  <div class="sumsub-form">
    <h2 class="sumsub-form__title">
      {{ getContent(verificationContent, defaultLocaleVerificationContent, 'sumsub.title') }}
    </h2>

    <div id="sumsub-websdk-container" class="sumsub-form__frame-container" />
  </div>
</template>

<script setup lang="ts">
  import snsWebSdk from '@sumsub/websdk';
  import type { IProfileVerification } from '~/types';
  import { getSumsubToken } from '@skeleton/api/profile';

  const verificationContent = ref<Maybe<IProfileVerification>>(inject('verificationContent'));
  const defaultLocaleVerificationContent = ref<Maybe<IProfileVerification>>(inject('defaultLocaleVerificationContent'));

  const getAccessToken = async () => {
    try {
      const { token } = await getSumsubToken();
      return token;
    } catch {
      return '';
    }
  };

  const launchWebSdk = async () => {
    const accessToken = await getAccessToken();

    const globalStore = useGlobalStore();
    const {
      public: { sumsub },
    } = useRuntimeConfig();
    const snsWebSdkInstance = snsWebSdk
      .init(accessToken, () => getAccessToken())
      .withConf({
        lang: globalStore.currentLocale?.code || 'en',
        theme: sumsub?.theme || 'dark',
      })
      .build();

    snsWebSdkInstance.launch('#sumsub-websdk-container');
  };

  onMounted(async () => {
    await launchWebSdk();
  });
</script>

<style src="~/assets/styles/components/verification/sumsub-form.scss" lang="scss" />

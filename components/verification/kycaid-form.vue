<template>
  <div class="kycaid-form">
    <h2 class="kycaid-form__title">
      {{ getContent(verificationContent, defaultLocaleVerificationContent, 'kycaid.title') }}
    </h2>

    <div v-if="iframeUrl" class="kycaid-form__frame-container">
      <iframe
        :src="iframeUrl"
        title="Kycaid"
        allow="microphone *;camera *;midi *;encrypted-media *;clipboard-read;clipboard-write;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileVerification } from '~/types';

  const verificationContent = ref<Maybe<IProfileVerification>>(inject('verificationContent'));
  const defaultLocaleVerificationContent = ref<Maybe<IProfileVerification>>(inject('defaultLocaleVerificationContent'));
  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const iframeUrl = ref<string | undefined>();
  const startKycaidFrame = async (): Promise<void> => {
    try {
      const { getKycaidUrl } = useCoreProfileApi();
      const { formUrl } = await getKycaidUrl();
      iframeUrl.value = `${formUrl}?lang=${currentLocale.value?.code?.toLowerCase() || 'en'}`;
    } catch {
      iframeUrl.value = undefined;
    }
  };

  onMounted(async () => {
    await startKycaidFrame();
  });
</script>

<style src="~/assets/styles/components/verification/kycaid-form.scss" lang="scss" />

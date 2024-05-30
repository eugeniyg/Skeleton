<template>
  <div class="sumsub-form">
    <h2 class="sumsub-form__title">
      {{ getContent(securityContent, defaultLocaleSecurityContent, 'sumsub.title') }}
    </h2>

    <div id="sumsub-websdk-container" class="sumsub-form__frame-container" />
  </div>
</template>

<script setup lang="ts">
  import snsWebSdk from '@sumsub/websdk';
  import type {IProfileSecurity} from "~/types";

  const securityContent = ref<Maybe<IProfileSecurity>>(inject('securityContent'));
  const defaultLocaleSecurityContent = ref<Maybe<IProfileSecurity>>(inject('defaultLocaleSecurityContent'));
  const { getContent } = useProjectMethods();

  const getAccessToken = async () => {
    const { getSumsubToken } = useCoreProfileApi();
    const { token } = await getSumsubToken();
    return token;
  }

  const launchWebSdk = async () => {
    const accessToken = await getAccessToken();

    const globalStore = useGlobalStore();
    const { public: { sumsub } } = useRuntimeConfig();
    const snsWebSdkInstance = snsWebSdk
      .init(
        accessToken,
        () => getAccessToken()
      )
      .withConf({
        lang: globalStore.currentLocale?.code || 'en',
        theme: sumsub?.theme || 'dark'
      })
      .build();

    snsWebSdkInstance.launch("#sumsub-websdk-container");
  };

  onMounted(async () => {
    await launchWebSdk();
  })
</script>

<style src="~/assets/styles/components/profile/sumsub-form.scss" lang="scss" />

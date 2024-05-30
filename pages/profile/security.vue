<template>
  <div class="security content">
    <div class="header">
      <h1 class="heading">{{ securityContent?.title || defaultLocaleSecurityContent?.title }}</h1>
    </div>

    <profile-security-documents />
    <profile-sumsub-verify v-if="sumsubIntegrated" />

    <hr/>

    <profile-security-password />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileSecurity } from '~/types';

  const { setPageMeta, getLocalesContentData } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const securityContent = ref<Maybe<IProfileSecurity>>();
  const defaultLocaleSecurityContent = ref<Maybe<IProfileSecurity>>();
  provide('securityContent', securityContent);
  provide('defaultLocaleSecurityContent', defaultLocaleSecurityContent);

  interface IPageContent {
    currentLocaleData: Maybe<IProfileSecurity>;
    defaultLocaleData: Maybe<IProfileSecurity>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    securityContent.value = contentData?.currentLocaleData;
    defaultLocaleSecurityContent.value = contentData?.defaultLocaleData;
    setPageMeta(securityContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('profileSecurityContent');
    if (data.value) return data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'security').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'security').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('profileSecurityContent', () => getPageContent());

  watch(content, () => {
    if (content.value) setContentData(content.value);
  }, { immediate: true });

  const runtimeConfig = useRuntimeConfig();
  const sumsubIntegrated = !!runtimeConfig.public.sumsub?.appToken;
</script>

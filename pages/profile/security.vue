<template>
  <div class="security content">
    <div class="header">
      <h1 class="heading">{{ securityContent?.title || defaultLocaleSecurityContent?.title }}</h1>
    </div>

    <profile-security-documents />

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
    const nuxtContentData = useNuxtData('profileSecurityContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'security').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'security').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('profileSecurityContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })
</script>

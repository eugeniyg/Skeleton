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
  import { IProfileSecurity } from '~/types';

  const { setPageSeo, getLocalesContentData } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleProfileSecurityContent', () => queryContent(currentLocale.value?.code as string, 'profile', 'security').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleProfileSecurityContent', () => queryContent(defaultLocale.value?.code as string, 'profile', 'security').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const securityContent: Maybe<IProfileSecurity> = currentLocaleData;
  const defaultLocaleSecurityContent: Maybe<IProfileSecurity> = defaultLocaleData;

  setPageSeo(securityContent?.seo);

  provide('documentsContent', securityContent?.documents);
  provide('defaultLocaleDocumentsContent', defaultLocaleSecurityContent?.documents);

  provide('passwordContent', securityContent?.password);
  provide('defaultLocalePasswordContent', defaultLocaleSecurityContent?.password);
</script>

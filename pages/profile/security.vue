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
  import { ProfileSecurityInterface } from '~/types';

  const { setPageSeo, findLocalesContentData } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);

  const securityContentRequest = await useAsyncData('securityContent', () => queryContent('profile')
    .where({ locale: { $in: contentLocalesArray.value } })
    .only(['security', 'locale']).find());

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(securityContentRequest.data.value);
  const securityContent: Maybe<ProfileSecurityInterface> = currentLocaleData?.security;
  const defaultLocaleSecurityContent: Maybe<ProfileSecurityInterface> = defaultLocaleData?.security;

  setPageSeo(securityContent?.seo);

  provide('documentsContent', securityContent?.documents);
  provide('defaultLocaleDocumentsContent', defaultLocaleSecurityContent?.documents);

  provide('passwordContent', securityContent?.password);
  provide('defaultLocalePasswordContent', defaultLocaleSecurityContent?.password);
</script>

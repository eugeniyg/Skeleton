<template>
  <div class="security content">
    <div class="header">
      <h1 class="heading">{{ securityContent?.title }}</h1>
    </div>

    <profile-security-documents />

    <hr/>

    <profile-security-password />
  </div>
</template>

<script setup lang="ts">
  import { ProfileSecurityInterface } from '~/types';

  const { getContentLocalesArray, findLocalesContentData } = useProjectMethods();

  const contentLocalesArr = getContentLocalesArray();

  const securityContentRequest = await useAsyncData('securityContent', () => queryContent('profile')
    .where({ locale: { $in: contentLocalesArr } })
    .only(['security', 'locale']).find());

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(securityContentRequest.data.value);
  const securityContent: Maybe<ProfileSecurityInterface> = currentLocaleData?.security;
  const defaultLocaleSecurityContent: Maybe<ProfileSecurityInterface> = defaultLocaleData?.security;

  const { setPageSeo } = useProjectMethods();
  setPageSeo(securityContent?.seo);

  provide('documentsContent', securityContent?.documents);
  provide('defaultLocaleDocumentsContent', defaultLocaleSecurityContent?.documents);

  provide('passwordContent', securityContent?.password);
  provide('defaultLocalesPasswordContent', defaultLocaleSecurityContent?.password);
</script>

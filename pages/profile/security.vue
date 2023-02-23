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
  import { storeToRefs } from 'pinia';
  import { ProfileSecurityInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const securityContentRequest = await useAsyncData('securityContent', () => queryContent(`profile/${currentLocale.value?.code}`).only(['security']).findOne());
  const securityContent: Maybe<ProfileSecurityInterface> = securityContentRequest.data.value?.security;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(securityContent?.seo);

  provide('documentsContent', securityContent?.documents);
  provide('passwordContent', securityContent?.password);
</script>

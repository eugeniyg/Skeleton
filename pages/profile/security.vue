<template>
  <div class="security content">
    <div class="header">
      <h1 class="heading">
        {{ currentLocaleContent?.title || defaultLocaleContent?.title }}
      </h1>
    </div>

    <profile-password />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileSecurity } from '~/types';

  const contentParams = {
    contentKey: 'profileSecurityContent',
    contentCollection: 'profile',
    contentSource: 'security',
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileSecurity>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
  const currentLocaleContent = computed(() => pageContent.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => pageContent.value?.defaultLocaleData);

  provide('securityContent', currentLocaleContent);
  provide('defaultLocaleSecurityContent', defaultLocaleContent);
</script>

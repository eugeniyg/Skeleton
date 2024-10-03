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

  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IProfileSecurity>({
    contentKey: 'profileSecurityContent',
    contentRoute: ['profile', 'security'],
    isPage: true
  });

  provide('securityContent', currentLocaleContent);
  provide('defaultLocaleSecurityContent', defaultLocaleContent);
</script>

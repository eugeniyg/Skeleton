<template>
  <div class="documents content">
    <div class="header">
      <h1 class="heading">
        {{ currentLocaleContent?.title || defaultLocaleContent?.title }}
      </h1>
    </div>

    <documents-general />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileDocuments } from '~/types';

  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IProfileDocuments>({
    contentKey: 'profileDocumentsContent',
    contentRoute: ['profile', 'documents'],
    isPage: true
  });

  provide('documentsContent', currentLocaleContent);
  provide('defaultLocaleDocumentsContent', defaultLocaleContent);
</script>

<template>
  <div class="not-found">
    <img class="img" src="/img/404.png" />

    <div class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.title') || pageStaticContent.title }}
    </div>

    <p class="text">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.description') || pageStaticContent.description }}
    </p>

    <button-base
      type="primary"
      size="md"
      :url="'/'"
    >
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.button.label') || pageStaticContent.button.label }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const pageStaticContent = {
    title: 'Something went wrong',
    description: 'The page you are trying to access does not exist or has been moved. Try going back to our homepage.',
    button: {
      label: 'Homepage',
      url: '/',
    },
  };

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/error.scss" lang="scss" />

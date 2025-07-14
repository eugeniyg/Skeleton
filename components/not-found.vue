<template>
  <div class="not-found">
    <atomic-image class="img" src="/img/404.png" not-lazy />

    <div class="title">
      {{
        getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.title') ||
        pageStaticContent.title
      }}
    </div>

    <p class="text">
      {{
        getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.description') ||
        pageStaticContent.description
      }}
    </p>

    <button-base type="primary" size="md" :url="'/'">
      {{
        getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.buttonLabel') ||
        pageStaticContent.buttonLabel
      }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const pageStaticContent = {
    title: 'Something went wrong',
    description: 'The page you are trying to access does not exist or has been moved. Try going back to our homepage.',
    buttonLabel: 'Homepage',
  };

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
</script>

<style src="~/assets/styles/error.scss" lang="scss" />

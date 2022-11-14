<template>
  <div class="not-found">
    <img class="img" src="@/assets/img/404.png" />
    <div class="title">{{ errorPageContent?.title || pageStaticContent.title }}</div>
    <p class="text">{{ errorPageContent?.description || pageStaticContent.description }}</p>

    <button-base
      type="primary"
      size="md"
      :url="'/'"
    >
      {{ errorPageContent?.button?.label || pageStaticContent.button.label }}
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
  const { errorPageContent } = storeToRefs(globalStore);
</script>

<style lang="scss">
@import "scss/error";
</style>

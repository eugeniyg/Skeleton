<template>
  <div class="not-found">
    <img class="img" src="/img/404.png" />
    <div class="title">
      {{ errorPageContent?.title || defaultLocaleErrorPageContent?.title || pageStaticContent.title }}
    </div>

    <p class="text">
      {{ errorPageContent?.description || defaultLocaleErrorPageContent?.description || pageStaticContent.description }}
    </p>

    <button-base
      type="primary"
      size="md"
      @click="goHome"
    >
      {{ getContent(errorPageContent, defaultLocaleErrorPageContent, 'button.label') || pageStaticContent.button.label }}
    </button-base>

    <dev-only>
      <div class="not-found" style="color: white">
        <div style="font-size: 80px; font-weight: 700; text-align: center">{{ props.error.statusCode }}</div>
        <div style="font-size: 32px; text-align: center">{{ props.error.statusMessage || props.error.message }}</div>
      </div>
    </dev-only>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    error: {
      type: Object,
      required: true,
    },
  });

  const pageStaticContent = {
    title: 'Something went wrong',
    description: 'The page you are trying to access does not exist or has been moved. Try going back to our homepage.',
    button: {
      label: 'Homepage',
      url: '/',
    },
  };

  const globalStore = useGlobalStore();
  const { errorPageContent, defaultLocaleErrorPageContent } = storeToRefs(globalStore);

  const { localizePath, getContent } = useProjectMethods();
  const goHome = () => clearError({
    redirect: localizePath(getContent(errorPageContent.value, defaultLocaleErrorPageContent.value, 'button.url')
      || pageStaticContent.button.url),
  });
</script>

<style lang="scss" scoped>
@import "@skeleton/assets/styles/error.scss";

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>

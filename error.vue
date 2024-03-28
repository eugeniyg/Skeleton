<template>
  <div class="not-found error-page">
    <atomic-image class="img" src="/img/404.png" />

    <div class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.title') || pageStaticContent.title }}
    </div>

    <p class="text">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.description') || pageStaticContent.description }}
    </p>

    <button-base
      type="primary"
      size="md"
      @click="goHome"
    >
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.buttonLabel') || pageStaticContent.buttonLabel }}
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
    buttonLabel: 'Homepage'
  };

  const globalStore = useGlobalStore();
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const route = useRoute();
  const goHome = () => {
    const urlLocale = route.params?.locale;
    const siteOrigin = window.location.origin;
    window.location.href = urlLocale ? `${siteOrigin}/${urlLocale}` : siteOrigin;
  };
</script>

<style src="~/assets/styles/error.scss" lang="scss" />

<template>
  <div class="not-found error-page">
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
  import { IErrorPage } from "~/types";

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
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { localizePath, getContent, getLocalesContentData } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleErrorPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'error').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleErrorPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'error').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const errorPageContent = currentLocaleData as IErrorPage;
  const defaultLocaleErrorPageContent = defaultLocaleData as IErrorPage;

  const goHome = () => clearError({
    redirect: localizePath(getContent(errorPageContent, defaultLocaleErrorPageContent, 'button.url')
      || pageStaticContent.button.url),
  });
</script>

<style src="~/assets/styles/error.scss" lang="scss" />

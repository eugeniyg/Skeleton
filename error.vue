<template>
  <div class="not-found error-page">
    <atomic-image class="img" src="/img/404.png" />

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

    <button-base type="primary" size="md" @click="goHome">
      {{
        getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'error.buttonLabel') ||
        pageStaticContent.buttonLabel
      }}
    </button-base>

    <dev-only>
      <client-only>
        <div style="font-size: 18px; color: red">
          <p>Error code: {{ props.error.statusCode }}</p>
          <p>{{ props.error.statusMessage || props.error.message }}</p>
          <p v-if="props.error.stack" v-html="props.error.stack" />
        </div>
      </client-only>
    </dev-only>
  </div>
</template>

<script setup lang="ts">
  import { preloaderDone } from '@skeleton/helpers/preloaderMethods';
  import { getContent } from '#imports';

  const props = defineProps({
    error: {
      type: Object,
      required: true,
    },
  });

  const pageStaticContent = {
    title: 'Something went wrong',
    description: 'The page you are trying to access does not exist or has been moved. Try going back to our homepage.',
    buttonLabel: 'Homepage',
  };

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const route = useRoute();
  const goHome = () => {
    const urlLocale = route.params?.locale;
    const siteOrigin = window.location.origin;
    window.location.href = urlLocale ? `${siteOrigin}/${urlLocale}` : siteOrigin;
  };

  onMounted(preloaderDone);
</script>

<style src="~/assets/styles/error.scss" lang="scss" />

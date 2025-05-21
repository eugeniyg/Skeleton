<template>
  <div class="geo-restricted">
    <atomic-image class="geo-restricted__logo" src="/img/logo-light.svg" />

    <div class="geo-restricted__content">
      <atomic-image
        class="geo-restricted__image"
        :src="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'geoRestricted.image')"
      />

      <h1 class="geo-restricted__title">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'geoRestricted.title') }}
      </h1>

      <div
        v-if="description"
        class="geo-restricted__description"
        v-html="DOMPurify.sanitize(marked.parse(description || '') as string, { FORBID_TAGS: ['style'] })"
      />

      <atomic-geo-info />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const description = computed(() => {
    return getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'geoRestricted.description'
    );
  });
</script>

<style src="~/assets/styles/layouts/geo-restricted.scss" lang="scss" />

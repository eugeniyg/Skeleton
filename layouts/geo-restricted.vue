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
        v-html="marked.parse(description)"
      />

      <div v-if="headerCountry" class="geo-restricted__geo">
        <atomic-image class="geo-restricted__geo-flag" :src="`/img/flags/${headerCountry.toLowerCase()}.svg`" />
        <span class="geo-restricted__geo-country">{{ headerCountry }}</span>
        <span class="geo-restricted__geo-ip">{{ headerIp }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from "marked";

  const globalStore = useGlobalStore();
  const {
    headerCountry,
    headerIp,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const description = computed(() => {
    return getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'geoRestricted.description');
  })
</script>

<style src="~/assets/styles/layouts/geo-restricted.scss" lang="scss" />


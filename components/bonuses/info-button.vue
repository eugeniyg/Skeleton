<template>
  <div class="bonuses-info-button">
    <span class="bonuses-info-button__title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.moreInfo') }}
    </span>

    <atomic-icon id="question" class="bonuses-info-button__icon" />
  </div>
</template>

<script setup lang="ts">
  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
</script>

<style src="~/assets/styles/components/bonuses/info-button.scss" lang="scss" />

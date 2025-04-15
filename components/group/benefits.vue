<template>
  <div
    v-if="globalComponentsContent?.benefits || defaultLocaleGlobalComponentsContent?.benefits"
    class="group-benefits"
  >
    <div class="group-benefits__list">
      <div v-for="(benefit, index) in benefitsList" :key="index" class="group-benefits__item">
        <atomic-image class="icon" :src="benefit.image" />

        <h2 class="title">{{ benefit.title }}</h2>
        <div class="text">{{ benefit.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();

  const benefitsList = computed(() => {
    if (globalComponentsContent?.benefits?.items?.length) return globalComponentsContent.benefits.items;
    return defaultLocaleGlobalComponentsContent?.benefits?.items || [];
  });
</script>

<style src="~/assets/styles/components/group/benefits.scss" lang="scss" />

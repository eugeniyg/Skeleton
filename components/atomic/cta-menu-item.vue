<template>
  <atomic-link class="cta-menu-item" :href="props.url" :target-blank="props.targetBlank">
    <atomic-picture :src="props.backgroundImage" alt="" />
    <span class="cta-menu-item__text">{{ props.label }}</span>
  </atomic-link>
</template>

<script setup lang="ts">
  const props = defineProps<{
    url: string;
    label: string;
    backgroundImage?: string;
    targetBlank?: boolean;
  }>();
</script>

<style src="~/assets/styles/components/atomic/cta-menu-item.scss" lang="scss" />

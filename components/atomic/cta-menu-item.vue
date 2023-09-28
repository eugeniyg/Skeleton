<template>
  <a class="cta-menu-item" :href="props.url">
    <atomic-picture :src="props.backgroundImage" alt=""/>
    <span class="cta-menu-item__text">{{ props.label }}</span>
  </a>
</template>

<script setup lang="ts">
  const props = defineProps<{
    url: string,
    label: string,
    backgroundImage?: string,
  }>()
</script>

<style src="~/assets/styles/components/atomic/cta-menu-item.scss" lang="scss" />

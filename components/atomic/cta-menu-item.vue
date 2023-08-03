<template>
  <a class="cta-menu-item" :href="props.url" :style="`background-image:url(${props.backgroundImage})`">
    <span class="cta-menu-item__text">{{ props.label }}</span>
  </a>
</template>

<script setup lang="ts">
  const props = defineProps<{
    url: string,
    label: string,
    backgroundImage: string,
  }>()
</script>

<style src="~/assets/styles/components/atomic/cta-menu-item.scss" lang="scss" />

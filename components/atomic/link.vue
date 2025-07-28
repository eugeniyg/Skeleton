<template>
  <nuxt-link
    :target="props.targetBlank ? '_blank' : null"
    :to="props.href?.startsWith('http') ? props.href : localizePath(props.href)"
  >
    <slot />
  </nuxt-link>
</template>

<script setup lang="ts">
  const props = defineProps<{
    href?: string;
    targetBlank?: boolean;
  }>();
</script>

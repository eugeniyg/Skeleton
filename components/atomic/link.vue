<template>
  <nuxt-link
    :target="targetBlank ? '_blank' : null"
    :to="props.href?.startsWith('http') ? props.href : localizePath(props.href)"
  >
    <slot/>
  </nuxt-link>
</template>

<script setup lang="ts">
  const props = defineProps<{
    href?: string;
    targetBlank?: boolean;
  }>();
  
  const { localizePath } = useProjectMethods();
</script>

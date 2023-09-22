<template>
  <picture class="picture">
    <source :srcset="createSrcSet(props.src)">
    <img :src="props.src" alt="">
  </picture>
</template>

<script setup lang="ts">
  const props = defineProps<{
    src?: string,
  }>();

  const { createSrcSet } = useProjectMethods();
</script>

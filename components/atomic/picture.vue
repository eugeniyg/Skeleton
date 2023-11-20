<template>
  <picture
    v-if="props.src && props.notLazy"
    :key="props.src"
    class="picture"
    data-not-lazy
  >
    <source :srcset="createSrcSet(props.src)" />
    <img :src="props.src" alt="" data-not-lazy />
  </picture>

  <picture v-else-if="props.src" :key="props.src" class="picture">
    <source :srcset="createSrcSet(props.src)" />
    <img :src="props.src" alt="" />
  </picture>
</template>

<script setup lang="ts">
  const props = defineProps<{
    src?: string,
    notLazy?: boolean
  }>();

  const { createSrcSet } = useProjectMethods();
</script>

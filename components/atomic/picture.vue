<template>
  <picture v-if="props.src && props.notLazy" key="static" class="picture" data-not-lazy>
    <source :srcset="createSrcSet(props.src)" />
    <img :src="props.src" alt="" />
  </picture>

  <picture v-else-if="props.src" key="lazy" class="picture">
    <source :srcset="createSrcSet(props.src)" />
    <img :src="props.src" alt="" />
  </picture>
</template>

<script setup lang="ts">
  import { createSrcSet } from '@skeleton/helpers/urlBuildMethods';

  const props = defineProps<{
    src?: string;
    notLazy?: boolean;
  }>();
</script>

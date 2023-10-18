<template>
  <img class="image" v-if="props.notLazy" :src="props.src" alt="" data-not-lazy />
  <img class="image" v-else :key="props.src" :src="props.src" alt="" />
</template>

<script setup lang="ts">
  const props = defineProps<{
    src?: string,
    notLazy?: boolean
  }>();
</script>

<template>
  <div class="paysis">
    <img
      v-for="(src, index) in props.items"
      :key="index"
      class="logo"
      :src="`/img${src}`"
      alt=""
      width="114"
      height="24"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style src="~/assets/styles/components/list/paysis.scss" lang="scss" />


<template>
  <div class="popover-notifications">
    <list-notifications :items="props.items" :max="props.maxCount"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    maxCount: {
      type: Number,
      default: 5,
    },
    items: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style  lang="scss" src="./style.scss"/>

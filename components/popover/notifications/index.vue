<template>
  <div class="popover-notifications">
    <list-notifications :items="props.items" :max="props.maxCount" :is-show-read-all-btn="true"/>
    <atomic-empty
      v-if="!props.items.length"
      title="Nothing found"
      sub-title="Try searching for something else"
      variant="notification"
    />
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

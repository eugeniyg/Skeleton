<template>
  <div class="grid">
    <div class="items">
      <card-base v-for="item in props.items" :key="item.id" v-bind="item"/>
    </div>

    <button-load-more v-if="props.meta.totalPages > props.meta.page" @click="emit('loadMore')">Load more</button-load-more>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    meta: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits(['loadMore']);
</script>

<style lang="scss" src="./style.scss"/>

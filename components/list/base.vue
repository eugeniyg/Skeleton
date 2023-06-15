<template>
  <div class="list">
    <div class="header">
      <slot name="header"/>
    </div>

    <div class="items">
      <slot
        v-for="(item, index) in props.items"
        :key="index"
        name="item"
        v-bind:item="item"
      />
    </div>
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

<style src="~/assets/styles/components/list/base.scss" lang="scss" />


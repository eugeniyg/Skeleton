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

<style lang="scss">
.list {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-shrink: 0;

  .header {
    @include font($heading-2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--padding, 0 0 #{rem(8px)} 0);
    color: var(--gray-300);
    margin: 0;
    width: 100%;

    * {
      padding: 0;
      margin: 0;
    }
  }

  .items {
    display: var(--display, flex);
    flex-wrap: wrap;
    grid-gap: rem(8px);
  }
}
</style>

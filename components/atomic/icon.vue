<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="icon">
    <use :xlink:href="`/sprite.svg#${props.id}`" :href="`/sprite.svg#${props.id}`"/>
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps<{id: string}>();
</script>

<style lang="scss">
.icon {
  flex-shrink: 0;
  width: var(--icon-size, 22px);
  height: var(--icon-size, 22px);
  color: var(--color, var(--gray-900));
  transition: color .2s ease-in-out;
}
</style>

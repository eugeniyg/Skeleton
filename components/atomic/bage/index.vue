<template>
  <span :class="classes">
    <atomic-icon :id="props.icon"/>
    {{ props.label }}
  </span>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string,
    icon: string,
    color: string,
  }>();

  const classes = computed(() => [
    'bage',
    `bg--${props.color}`,
  ]);
</script>

<style lang="scss" src="./style.scss" />

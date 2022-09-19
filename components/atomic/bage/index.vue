<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => ['new', 'card-new', 'card-hot'].includes(val),
      default: 'new',
    },
  });
  const classes = computed(() => ({
    bage: true,
    [`type-${props.variant}`]: props.variant,
  }));
</script>

<style lang="scss" src="./style.scss" />

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
  // const variants = {
  //   "new": {
  //     title: 'new',
  //     icon: 'new',
  //   },
  //   "hot": {
  //     title: 'hot',
  //     icon: 'hot',
  //   },
  //   "fast-games": {
  //     title: 'fast games',
  //     icon: 'turbo-games',
  //   },
  //   "buy-bonus": {
  //     title: 'buy bonus',
  //     icon: 'bonuses',
  //   }
  // };
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => ['new', 'fast-games', 'hot', 'buy-bonus'].includes(val),
      default: 'new',
    },
  });
  const classes = computed(() => ({
    bage: true,
    [`variant-${props.variant}`]: props.variant,
  }));
</script>

<style lang="scss" src="./style.scss" />

<template>
  <div class="bet-status" :class="statusClassName">
    <slot />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    variant: number;
  }>();
  const statusClassName = computed(() => `variant-${props.variant}`);
</script>

<style src="~/assets/styles/components/atomic/bet-status.scss" lang="scss" />

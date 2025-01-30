<template>
  <div class="invoice-status" :class="classes">
    <atomic-icon :id="iconId" />
    <slot />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    variant: number;
  }>();

  const items: { [index: string]: string } = {
    '1': 'clock',
    '2': 'done',
    '3': 'warning',
    '4': 'clock',
    '5': 'preparing',
  };
  const iconId = computed(() => items[props.variant]);
  const classes = computed(() => `invoice-status--variant-${props.variant}`);
</script>

<style src="~/assets/styles/components/atomic/invoice-status.scss" lang="scss" />

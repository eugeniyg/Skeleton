<template>
  <div class="bet-status" :class="statusClassName">{{ statusTitle }}</div>
</template>

<script setup type="ts">
  const statuses = {
    pending: 'Pending',
    won: 'Won',
    lost: 'Lost',
    refund: 'Refund',
    'cash-out': 'Cash out',
  };
  const props = defineProps({
    variant: string,
  });
  const statusClassName = computed(() => `variant-${props.variant}`);
  const statusTitle = computed(() => statuses[props.variant]);
</script>

<style lang="scss" src="./style.scss"></style>


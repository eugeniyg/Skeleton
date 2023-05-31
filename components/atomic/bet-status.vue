<template>
  <div class="bet-status" :class="statusClassName">
    <slot />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => [
        'pending',
        'won',
        'lost',
        'refund',
        'cashout',
      ].includes(val),
    },
  });
  const statusClassName = computed(() => `variant-${props.variant}`);
</script>

<style src="~/assets/styles/components/atomic/bet-status.scss" lang="scss" />

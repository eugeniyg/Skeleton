<template>
  <div class="row-status" :class="classes">
    <slot>statusText</slot>
    <atomic-tooltip v-if="variant === 'closed'" :text="props.tooltip"/>
    <atomic-icon v-else :id="iconId"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    variant?: 'current'|'active'|'closed'|'pending'|'success'|'failed'|'unfinished'|'canceled'|'rejected'|'review'|'processing';
    tooltip?: string;
  }>();

  const items:{[index: string]:string} = {
    active: 'dot',
    current: 'dot',
    closed: 'info',
    pending: 'clock',
    success: 'done',
    failed: 'warning',
    rejected: 'warning',
    unfinished: 'clock',
    review: 'clock',
    processing: 'clock',
    canceled: 'warning',
  };
  const iconId = computed(() => items[props.variant || 'current']);
  const classes = computed(() => `is-${props.variant || 'current'}`);
</script>

<style src="~/assets/styles/components/atomic/row-status.scss" lang="scss" />

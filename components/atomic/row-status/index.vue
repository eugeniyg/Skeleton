<template>
  <div class="row-status" :class="classes">
    <slot>statusText</slot>
    <atomic-icon :id="iconId"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => ['current', 'closed', 'pending', 'success', 'failed', 'unfinished', 'canceled'].includes(val),
      default: 'current',
    },
    items: {
      type: Object,
      default: () => ({
        current: 'dot',
        closed: 'ui-info',
        pending: 'ui-clock',
        success: 'ui-done',
        failed: 'ui-warning',
        unfinished: 'ui-clock',
        canceled: 'ui-warning',
      }),
    },
  });
  const iconId = computed(() => props.items[props.variant]);
  const classes = computed(() => `is-${props.variant}`);
</script>

<style lang="scss" src="./style.scss"/>

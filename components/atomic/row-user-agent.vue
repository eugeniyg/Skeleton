<template>
  <div class="row-user-agent">
    <slot>user agent text</slot>
    <atomic-tooltip :text="props.tooltip" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{ tooltip: string }>();
</script>

<style src="~/assets/styles/components/atomic/row-user-agent.scss" lang="scss" />

<template>
  <div class="row-user-agent">
    <slot>user agent text</slot>
    <atomic-tooltip :text="props.tooltip"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{tooltip: string}>();
</script>

<style lang="scss" src="./style.scss"/>

<template>
  <div class="cat-heading">
    <atomic-icon v-if="props.icon" :id="props.icon" />
    <slot />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{ icon?: string }>();
</script>

<style src="~/assets/styles/components/atomic/cat-heading.scss" lang="scss" />

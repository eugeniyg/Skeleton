<template>
  <div class="bonuses-waiting-results">
    <atomic-icon id="clock" class="bonuses-waiting-results__icon" />

    <span class="bonuses-waiting-results__label">{{ props.text }}</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    text?: string;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/waiting-results.scss" lang="scss" />

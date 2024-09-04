<template>
  <div class="bonuses-info-button">
    <span class="bonuses-info-button__title">
      {{ props.label }}
    </span>

    <atomic-icon id="question" class="bonuses-info-button__icon" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label?: string;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/info-button.scss" lang="scss"/>
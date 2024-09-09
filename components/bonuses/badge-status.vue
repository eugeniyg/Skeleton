<template>
  <div class="bonuses-badge-status" :class="`is-${props.status}`">
    <atomic-icon id="stars" class="bonuses-badge-status__icon" />

    <span class="bonuses-badge-status__label">
      {{ props.title }}
    </span>

    <span v-if="props.status === 'available-deposit'" class="bonuses-badge-status__text">
      {{ props.subtitle }}
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    status: 'active'|'available'|'available-deposit';
    title?: string;
    subtitle?: string;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/badge-status.scss" lang="scss"/>
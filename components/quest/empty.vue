<template>
  <div class="quest-empty">
    <atomic-image class="quest-empty__image" :src="props.image" />

    <div class="quest-empty__title">
      {{ props.title }}
    </div>

    <div class="quest-empty__description">
      {{ props.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    image?: string;
    title?: string;
    description?: string;
  }>();
</script>

<style src="~/assets/styles/components/quest/empty.scss" lang="scss" />

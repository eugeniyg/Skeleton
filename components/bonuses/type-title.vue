<template>
  <div class="bonuses-type-title">
    <span>{{ props.title }}</span>
    <div class="bonuses-type-title__count" v-if="props.count">({{ props.count }})</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    count?: string;
    title: string;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/type-title.scss" lang="scss"/>

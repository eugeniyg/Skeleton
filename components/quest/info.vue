<template>
  <div class="quest-info">
    <div class="quest-info__title">{{ props.title }}</div>
    <div class="quest-info__items">
      <div class="quest-info__item">
        <span class="quest-info__label">Min:</span>
        <span class="quest-info__value">{{ props.min }}</span>
      </div>
      <div class="quest-info__item">
        <span class="quest-info__label">Max:</span>
        <span class="quest-info__value">{{ props.max }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
    min: string;
    max: string;
  }>();
</script>

<style src="~/assets/styles/components/quest/info.scss" lang="scss"/>

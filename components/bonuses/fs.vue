<template>
  <div class="bonuses-fs">
    <div class="bonuses-fs__row">
      <span class="bonuses-fs__count">{{ props.count }}</span>
      <span class="bonuses-fs__divider">/</span>
      <span class="bonuses-fs__total-count">{{ props.totalCount }}</span>
      <span class="bonuses-fs__label">FS</span>
    </div>
    <bonuses-progress v-if="props.progress" :value="props.progress"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    count: number;
    totalCount: number;
    progress: number;
  }>()
</script>

<style src="~/assets/styles/components/bonuses/fs.scss" lang="scss"/>

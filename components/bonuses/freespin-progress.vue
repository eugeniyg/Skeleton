<template>
  <div class="bonuses-freespin-progress">
    <div class="bonuses-freespin-progress__row">
      <span class="bonuses-freespin-progress__count">{{ props.bonusInfo.usedCount }}</span>
      <span class="bonuses-freespin-progress__divider">/</span>
      <span class="bonuses-freespin-progress__total-count">{{ props.bonusInfo.count }}</span>
      <span class="bonuses-freespin-progress__label">FS</span>
    </div>

    <bonuses-progress :progress="props.bonusInfo.progress" is-free-spin />
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerFreeSpin } from '@skeleton/api/types';

  const props = defineProps<{
    bonusInfo: IPlayerFreeSpin;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/freespin-progress.scss" lang="scss" />

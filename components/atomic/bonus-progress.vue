<template>
  <div class="bonus-progress">
    <div class="bonus-progress__info">
      <div class="bonus-progress__info-data">
        <span class="bonus-progress__info-label">
          <span>{{ props.wageringLabel }}</span>
          (<span>x</span>{{ props.bonusInfo?.wagerSportsbook || props.bonusInfo?.wagerCasino }}):
        </span>

        <span class="bonus-progress__info-value">
          {{ wageredFormatSum.amount }}
          {{ wageredFormatSum.currency }}
        </span>
      </div>
    </div>

    <div class="bonus-progress__bar">
      <div
        class="bonus-progress__bar-filled"
        :data-progress="`${props.bonusInfo?.currentWagerPercentage || 0}%`"
        :style="`--progress: ${props.bonusInfo?.currentWagerPercentage || 0}%`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerBonus } from '@skeleton/api/types';
  import { formatBalance } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    wageringLabel: string;
    bonusInfo?: IPlayerBonus;
  }>();

  const wageredFormatSum = computed(() => {
    return formatBalance(props.bonusInfo?.currency, props.bonusInfo?.currentWagerAmount);
  });
</script>

<style src="~/assets/styles/components/atomic/bonus-progress.scss" lang="scss" />

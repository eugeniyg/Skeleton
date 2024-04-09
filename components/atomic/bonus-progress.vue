<template>
  <div class="bonus-progress">
    <div class="bonus-progress__info">
      <div class="bonus-progress__info-data">
            <span class="bonus-progress__info-label">
              <span>{{ props.wageringLabel }}</span>
              (<span>x</span>{{ props.bonusInfo.wagerSportsbook }}):
            </span>

        <span class="bonus-progress__info-value">
              {{ props.bonusInfo.currentWagerAmount }}
              {{ props.bonusInfo.currency }}
            </span>
      </div>
    </div>

    <div class="bonus-progress__bar">
      <div
        class="bonus-progress__bar-filled"
        :data-progress="`${props.bonusInfo.currentWagerPercentage}%`"
        :style="`--progress: ${props.bonusInfo.currentWagerPercentage}%`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    wageringLabel: string,
    bonusInfo: {
      wagerSportsbook: number,
      currentWagerAmount: number,
      currency: string,
      currentWagerPercentage: number
    }
  }>();
</script>

<style src="~/assets/styles/components/atomic/bonus-progress.scss" lang="scss" />

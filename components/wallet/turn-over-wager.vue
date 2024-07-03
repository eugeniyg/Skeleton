<template>
  <div class="turn-over-wager">
    <div class="turn-over-wager__img">
      <atomic-image
        :src="getContent(popupsData, defaultLocalePopupsData, 'turnOverWager.image')"
      />
    </div>

    <div class="turn-over-wager__title">
      {{ getContent(popupsData, defaultLocalePopupsData, 'turnOverWager.title') }}
    </div>

    <p class="turn-over-wager__description">{{ getContent(popupsData, defaultLocalePopupsData, 'turnOverWager.description') }}</p>

    <div class="turn-over-wager__info">
      <div class="turn-over-wager__info-wager">
        <span class="turn-over-wager__info-wager-label">
          {{ getContent(popupsData, defaultLocalePopupsData, 'turnOverWager.wagerLabel') }}:
        </span>

        <span class="turn-over-wager__info-wager-value">
          {{ turnOverWagerData.turnOverWager }}
        </span>
      </div>

      <div class="turn-over-wager__info-progress">
        <div
          class="turn-over-wager__info-progress-filled"
          :data-progress="`${progress || 0}%`"
          :style="`--progress: ${progress || 0}%`"
        />
      </div>

      <div class="turn-over-wager__info-amount">
        <div>
          <span class="turn-over-wager__info-amount-label">
            {{ getContent(popupsData, defaultLocalePopupsData, 'turnOverWager.placedLabel') }}:
          </span>

          <span class="turn-over-wager__info-amount-value">{{ placedAmount }}</span>
        </div>

        <div>
          <span class="turn-over-wager__info-amount-label">
            {{ getContent(popupsData, defaultLocalePopupsData, 'turnOverWager.totalLabel') }}:
          </span>

          <span class="turn-over-wager__info-amount-value">{{ totalAmount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getContent, formatBalance } = useProjectMethods();
const { popupsData, defaultLocalePopupsData } = useGlobalStore();
const riskStore = useRiskStore();
const { turnOverWagerData } = storeToRefs(riskStore);

const placedAmount = computed(() => {
  if (turnOverWagerData.value.turnOverWagerAmount > 0 && turnOverWagerData.value.currency) {
    const balanceData = formatBalance(turnOverWagerData.value.currency, turnOverWagerData.value.total - turnOverWagerData.value.turnOverWagerAmount);
    return `${balanceData.amount} ${balanceData.currency}`;
  }
  return '';
});

const totalAmount = computed(() => {
  if (turnOverWagerData.value.total > 0 && turnOverWagerData.value.currency) {
    const balanceData = formatBalance(turnOverWagerData.value.currency, turnOverWagerData.value.total);
    return `${balanceData.amount} ${balanceData.currency}`;
  }
  return '';
});

const progress = computed(() => {
  const progressValue = (turnOverWagerData.value.total - turnOverWagerData.value.turnOverWagerAmount) / turnOverWagerData.value.total * 100;
  return Number(progressValue.toFixed(2));
});
</script>

<style src="~/assets/styles/components/wallet/turn-over-wager.scss" lang="scss" />

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

    <div class="turn-over-wager__wager">
        <span class="turn-over-wager__wager-label">
          {{ getContent(popupsData, defaultLocalePopupsData, 'turnOverWager.wagerLabel') }} (x{{ turnOverWagerData.turnOverWager }}):
        </span>

      <span class="turn-over-wager__wager-value">
          {{ turnOverWagerValue }}
        </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getContent, formatBalance } = useProjectMethods();
const { popupsData, defaultLocalePopupsData } = useGlobalStore();
const riskStore = useRiskStore();
const { turnOverWagerData } = storeToRefs(riskStore);
const turnOverWagerValue = computed(() => {
  if (turnOverWagerData.value.turnOverWagerAmount > 0 && turnOverWagerData.value.currency) {
    const balanceData = formatBalance(turnOverWagerData.value.currency, turnOverWagerData.value.turnOverWagerAmount);
    return `${balanceData.amount} ${balanceData.currency}`;
  }
  return '';
});
</script>

<style src="~/assets/styles/components/wallet/turn-over-wager.scss" lang="scss" />

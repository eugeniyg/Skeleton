<template>
  <div class="turn-over-wager">
    <div class="turn-over-wager__img">
      <atomic-image :src="getContent(walletContent, defaultLocaleWalletContent, 'withdraw.turnOverWager.image')" />
    </div>

    <div class="turn-over-wager__title">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'withdraw.turnOverWager.title') }}
    </div>

    <p class="turn-over-wager__description">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'withdraw.turnOverWager.description') }}
    </p>

    <div class="turn-over-wager__info">
      <div class="turn-over-wager__info-wager">
        <span class="turn-over-wager__info-wager-label">
          {{ getContent(walletContent, defaultLocaleWalletContent, 'withdraw.turnOverWager.wagerLabel') }}:
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
            {{ getContent(walletContent, defaultLocaleWalletContent, 'withdraw.turnOverWager.placedLabel') }}:
          </span>

          <span class="turn-over-wager__info-amount-value">{{ placedAmount }}</span>
        </div>

        <div>
          <span class="turn-over-wager__info-amount-label">
            {{ getContent(walletContent, defaultLocaleWalletContent, 'withdraw.turnOverWager.totalLabel') }}:
          </span>

          <span class="turn-over-wager__info-amount-value">{{ totalAmount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');

  const { getContent, formatBalance } = useProjectMethods();
  const { currencies } = useGlobalStore();
  const riskStore = useRiskStore();
  const { turnOverWagerData } = storeToRefs(riskStore);

  const placedAmount = computed(() => {
    if (turnOverWagerData.value.turnOverWagerAmount > 0 && turnOverWagerData.value.currency) {
      const findCurrency = currencies.find(currency => currency.code === turnOverWagerData.value.currency);
      if (!findCurrency) return '';
      const wageredAmount = turnOverWagerData.value.total - turnOverWagerData.value.turnOverWagerAmount;
      const roundWageredAmount = Math.round(wageredAmount * findCurrency.subunitToUnit) / findCurrency.subunitToUnit;
      const balanceData = formatBalance(turnOverWagerData.value.currency, roundWageredAmount);
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
    const progressValue =
      ((turnOverWagerData.value.total - turnOverWagerData.value.turnOverWagerAmount) / turnOverWagerData.value.total) *
      100;
    return Math.round(progressValue * 100) / 100;
  });
</script>

<style src="~/assets/styles/components/wallet/turn-over-wager.scss" lang="scss" />

<template>
  <div class="bonuses-wager-progress">
    <div v-if="props.bonusInfo.wagerCasino" class="bonuses-wager-progress__row">
      <atomic-icon id="cherry" class="bonuses-wager-progress__icon" />

      <span class="bonuses-wager-progress__label">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.wager') }}
      </span>

      <span class="bonuses-wager-progress__value"> (x{{ props.bonusInfo.wagerCasino }}): </span>

      <span class="bonuses-wager-progress__amount">
        {{ currentCasinoAmount.amount }}
      </span>

      <span class="bonuses-wager-progress__divider">/</span>

      <span class="bonuses-wager-progress__amount">{{ fullCasinoAmount.amount }}</span>
      <span class="bonuses-wager-progress__currency">{{ fullCasinoAmount.currency }}</span>
    </div>

    <div v-if="props.bonusInfo.wagerSportsbook" class="bonuses-wager-progress__row">
      <atomic-icon id="sportsbook-football" class="bonuses-wager-progress__icon" />

      <span class="bonuses-wager-progress__label">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.wager') }}
      </span>

      <span class="bonuses-wager-progress__value"> (x{{ props.bonusInfo.wagerSportsbook }}): </span>

      <span class="bonuses-wager-progress__amount">
        {{ currentSportsbookAmount.amount }}
      </span>

      <span class="bonuses-wager-progress__divider">/</span>

      <span class="bonuses-wager-progress__amount">
        {{ fullSportsbookAmount.amount }}
      </span>

      <span class="bonuses-wager-progress__currency">{{ fullSportsbookAmount.currency }}</span>
    </div>

    <bonuses-progress :progress="props.bonusInfo.currentWagerPercentage" />

    <bonuses-waiting-results
      v-if="props.bonusInfo.currentWagerPercentage === 100 && props.bonusInfo.openedTransactionsCount > 0"
      :text="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.waitingResult')"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerBonus } from '@skeleton/api/types';
  import { formatBalance } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    bonusInfo: IPlayerBonus;
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const walletStore = useWalletStore();
  const { activeAccountType } = storeToRefs(walletStore);

  const currentCasinoAmount = computed<{ currency: string; amount: number }>(() => {
    return formatBalance(props.bonusInfo.currency, props.bonusInfo.currentWagerCasinoAmount);
  });

  const fullCasinoAmount = computed<{ currency: string; amount: number }>(() => {
    const fullAmount = props.bonusInfo.currentWagerCasinoAmount + props.bonusInfo.requiredWagerCasinoAmount;
    const roundAmount = Number(fullAmount.toFixed(activeAccountType.value === 'fiat' ? 2 : 8));
    return formatBalance(props.bonusInfo.currency, roundAmount);
  });

  const currentSportsbookAmount = computed<{ currency: string; amount: number }>(() => {
    return formatBalance(props.bonusInfo.currency, props.bonusInfo.currentWagerSportsbookAmount);
  });

  const fullSportsbookAmount = computed<{ currency: string; amount: number }>(() => {
    const fullAmount = props.bonusInfo.currentWagerSportsbookAmount + props.bonusInfo.requiredWagerSportsbookAmount;
    const roundAmount = Number(fullAmount.toFixed(activeAccountType.value === 'fiat' ? 2 : 8));
    return formatBalance(props.bonusInfo.currency, roundAmount);
  });
</script>

<style src="~/assets/styles/components/bonuses/wager-progress.scss" lang="scss" />

<template>
  <div class="bonuses-wager">
    <div class="bonuses-wager__row is-casino">
      <atomic-icon id="cherry" class="bonuses-wager__icon"/>
      <span class="bonuses-wager__label">Wager</span>
      <span v-if="props.casinoWager" class="bonuses-wager__value">(x{{ props.casinoWager }}):</span>
      <span v-if="props.casinoWagerAmountFrom" class="bonuses-wager__amount">{{ props.casinoWagerAmountFrom }}</span>
      <template v-if="props.casinoWagerAmountTo">
        <span class="bonuses-wager__divider">/</span>
        <span class="bonuses-wager__amount">{{ props.casinoWagerAmountTo }}</span>
      </template>
      <span v-if="casinoWagerCurrency" class="bonuses-wager__currency">{{ props.casinoWagerCurrency }}</span>
    </div>
    
    <div class="bonuses-wager__row is-sportsbook">
      <atomic-icon id="sportsbook-football" class="bonuses-wager__icon"/>
      <span class="bonuses-wager__label">Wager</span>
      <span v-if="props.sportsbookWager" class="bonuses-wager__value">(x{{ props.sportsbookWager }}):</span>
      <span v-if="props.sportsbookWagerAmountFrom" class="bonuses-wager__amount">{{ props.sportsbookWagerAmountFrom }}</span>
      <template v-if="props.sportsbookWagerAmountTo">
        <span class="bonuses-wager__divider">/</span>
        <span class="bonuses-wager__amount">{{ props.sportsbookWagerAmountTo }}</span>
      </template>
      <span v-if="props.sportsbookWagerCurrency" class="bonuses-wager__currency">{{ props.sportsbookWagerCurrency }}</span>
    </div>
    
    <bonuses-progress v-if="props.progress" :value="props.progress"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    casinoWager?: string;
    casinoWagerAmountFrom?: string;
    casinoWagerAmountTo?: string;
    casinoWagerCurrency?: string;
    sportsbookWager?: string;
    sportsbookWagerAmountFrom?: string;
    sportsbookWagerAmountTo?: string;
    sportsbookWagerCurrency?: string;
    progress?: number;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/wager.scss" lang="scss"/>

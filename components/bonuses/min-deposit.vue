<template>
  <div class="bonuses-min-deposit" v-if="props.minDeposit || props.wager">
    <div class="bonuses-min-deposit__row" v-if="props.minDeposit">
      <span class="bonuses-min-deposit__label">Min deposit:</span>
      <span class="bonuses-min-deposit__amount">{{ props.minDeposit?.amount }}</span>
      <span class="bonuses-min-deposit__currency">{{ props.minDeposit?.currency }}</span>
    </div>
    
    <div v-if="props.wager" class="bonuses-min-deposit__wager">
      <span class="bonuses-min-deposit__label">Wager:</span>
      <template v-for="item in wager">
        <atomic-icon :id="iconMap?.[item.category]" class="bonuses-min-deposit__icon"/>
        <span class="bonuses-min-deposit__value">x{{ item.value }}</span>
      </template>
    </div>
    
    <bonuses-more-link/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    minDeposit?: {
      amount: string;
      currency: string;
    };
    wager?: {
      category: 'sportsbook'|'casino';
      value: string;
    }[]
  }>();
  
  
  const iconMap = {
    sportsbook: 'sportsbook-football',
    casino: 'cherry',
  };
</script>

<style src="~/assets/styles/components/bonuses/min-deposit.scss" lang="scss"/>

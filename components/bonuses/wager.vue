<template>
  <div class="bonuses-wager">
    <div class="bonuses-wager__row">
      <atomic-icon :id="icon" class="bonuses-wager__icon"/>
      <span class="bonuses-wager__label">Wager</span>
      <span v-if="props.wager" class="bonuses-wager__value">(x{{ props.wager }}):</span>
      <span v-if="props.amountFrom" class="bonuses-wager__amount">{{ props.amountFrom }}</span>
      <template v-if="props.amountTo">
        <span class="bonuses-wager__divider">/</span>
        <span class="bonuses-wager__amount">{{ props.amountTo }}</span>
      </template>
      <span v-if="currency" class="bonuses-wager__currency">{{ props.currency }}</span>
    </div>
    <bonuses-progress v-if="props.progress" :value="props.progress"/>
    <bonuses-waiting-results/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    category: 'sportsbook'|'casino',
    wager?: string;
    amountFrom?: string;
    amountTo?: string;
    currency?: string;
    progress?: number;
  }>();
  
  const iconMap = {
    sportsbook: 'sportsbook-football',
    casino: 'cherry',
  }
  
  const icon = computed(() => iconMap[props.category]);
</script>

<style src="~/assets/styles/components/bonuses/wager.scss" lang="scss"/>

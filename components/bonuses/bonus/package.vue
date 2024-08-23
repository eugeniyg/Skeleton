<template>
  <div class="bonus-package" :class="{'is-active': props.isActive }">
    <div class="bonus-package__container">
      <div class="bonus-package__header">
        <bonuses-badge variant="package"/>
        <bonuses-badge-status status="active"/>
      </div>
      
      <div class="bonus-package__body">
        <atomic-image :src="bonusPackage.image"/>
        <div class="bonus-package__title" v-html="marked.parse(bonusPackage.title)"/>
        
        
        <div class="bonus-package__tb">
          <template v-for="bonus in bonusPackage.bonuses" :key="bonus.name">
            <div class="bonus-package__tb-th">{{ bonus.name }}:</div>
            <div class="bonus-package__tb-td">
              <bonuses-icon
                v-if="bonus.status"
                :status="bonus.status"
              />
              <bonuses-wager
                v-if="bonus.casinoWagerAmountFrom || bonus.casinoWagerAmountTo || bonus.sportsbookWagerAmountFrom || bonus.sportsbookWagerAmountTo"
                :casino-wager-amount-from="bonus.casinoWagerAmountFrom"
                :casino-wager-amount-to="bonus.casinoWagerAmountTo"
                :casino-wager-currency="bonus.casinoWagerCurrency"
                :casino-wager="bonus.casinoWager"
                :sportsbook-wager-amount-from="bonus.sportsbookWagerAmountFrom"
                :sportsbook-wager-amount-to="bonus.sportsbookWagerAmountTo"
                :sportsbook-wager-currency="bonus.sportsbookWagerCurrency"
                :sportsbook-wager="bonus.sportsbookWager"
                :progress="bonus.progress"
              />
            </div>
          </template>
        </div>
      </div>
    
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  const props = defineProps<{
    isActive?: boolean;
  }>();
  
  const { bonuses } = useFakeStore();
  
  const bonusPackage = computed(() => bonuses.package);

</script>

<style src="~/assets/styles/components/bonuses/bonus/package.scss" lang="scss"/>

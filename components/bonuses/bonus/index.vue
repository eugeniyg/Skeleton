<template>
  <div class="bonuses-bonus" :class="{'is-locked': props.type === 'percent' && props.status === 'future'}">
    <div class="bonuses-bonus__container">
      <div class="bonuses-bonus__header">
        <bonuses-badge-type :mode="props.type"/>
        <bonuses-badge-game v-if="props.type === 'fs'" />
        <bonuses-badge-status :mode="props.status"/>
      </div>
      
      <div class="bonuses-bonus__body">
        <div class="bonuses-bonus__name">
          <span class="bonuses-bonus__name-text">Play Limbo Rider and get up to</span>
          <span class="bonuses-bonus__name-value">0.0035 mBTC</span>
        </div>
        
        
        <div v-if="props.type === 'cashback' " class="bonuses-bonus__cashback-name">
          Take your <span class="bonuses-bonus__cashback-name-value">10% <br>cashback</span> every Friday
        </div>
        
        
        <bonuses-min-deposit
          v-bind="bonuses.bonus"
        />
        
        <bonuses-fs
          v-if="props.type === 'fs'"
          :count="15"
          :total-count="100"
          :progress="15"
        />
      </div>
      
      <div class="bonuses-bonus__actions">
        <button-base class="bonuses-bonus__spin-btn" v-if="props.type === 'fs'" type="primary" size="md">Spin</button-base>
        
        <button-base
          v-if="props.type === 'percent' && props.status === 'future'"
          class="bonuses-bonus__locked-btn"
          type="primary"
          size="md"
          disabled
        >
          <atomic-icon id="locked"/>
          <span>Active after 4 deposit</span>
        </button-base>
        
        <button-base
          v-if="props.type === 'cash'"
          class="bonuses-bonus__locked-btn"
          type="primary"
          size="md"
          disabled
        >
          Claim Bonus
        </button-base>
        
        
        
        <div class="bonuses-bonus__activator" v-if="props.type === 'fs' || props.type === 'cashback'">
          <button-base class="bonuses-bonus__activate-btn" type="primary" size="md">Activate</button-base>
          <bonuses-timer expired-at="2024-09-20T09:25:51.331Z" />
        </div>
        
        <button-base
          v-if="props.type === 'fs' || props.type === 'cashback'"
          type="ghost" size="xs">Delete this bonus</button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface IBonusProps {
    type: 'cash' | 'percent' | 'cashback' | 'fs';
    status: 'active' | 'availableNextDeposit' | 'available' | 'future';
  }
  
  const props = defineProps<IBonusProps>();
  
  const { bonuses } = useFakeStore();
</script>


<style src="~/assets/styles/components/bonuses/bonus/index.scss" lang="scss"/>

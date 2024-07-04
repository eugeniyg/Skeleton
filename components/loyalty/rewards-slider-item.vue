<template>
  <div class="loyalty-rewards-slider__item" :class="orderClass">
    <div class="loyalty-rewards-slider__item-header">
      <div class="loyalty-rewards-slider__item-images">
        <atomic-image
          class="loyalty-rewards-slider__item-back-bg"
          src="/img/uploads/loyalty-rays.png"
        />
        
        <atomic-image
          class="loyalty-rewards-slider__item-face-bg"
          :src="props.image"
        />
        
        <div class="loyalty-rewards-slider__item-icon">
          <atomic-icon id="flash"/>
        </div>
      </div>
      
      <div class="loyalty-rewards-slider__item-title">
        <span class="loyalty-rewards-slider__item-title-text">{{ props.name }}</span>
        <span class="loyalty-rewards-slider__item-title-number">{{ props.number }}</span>
      </div>
      
      <div class="loyalty-rewards-slider__item-status-points">
        <div class="loyalty-rewards-slider__item-status-points-label">
          <span>{{ props.statusPointsLabel }}</span>
          <atomic-icon id="info"/>
        </div>
        <div class="loyalty-rewards-slider__item-status-points">
          <div class="loyalty-rewards-slider__item-status-points-label">
            {{ props.statusPointsLabel }}
          </div>
          <div class="loyalty-rewards-slider__item-status-points-value">
            {{ props.statusPointsValue }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="loyalty-rewards-slider__item-content">
      
      <div class="loyalty-rewards-slider__item-rank-bonus">
        <div
          class="loyalty-rewards-slider__item-rank-bonus-value"
          :class="{'has-number': Number(props.rankBonusValue)}"
        >
          {{ props.rankBonusValue }}
        </div>
        <div class="loyalty-rewards-slider__item-rank-bonus-label">
          {{ props.rankBonusLabel }} {{ props.rankBonusCurrency }}
        </div>
      </div>
      
      <div class="loyalty-rewards-slider__item-cashback">
        <div
          class="loyalty-rewards-slider__item-cashback-value"
          :class="{'has-number': parseInt(props.cashBackValue)}"
        >
          {{ props.cashBackValue }}
        </div>
        <div class="loyalty-rewards-slider__item-cashback-label">
          {{ props.cashBackLabel }}
        </div>
      </div>
      
      <atomic-divider v-id="props.options" class="loyalty-rewards-slider__item-divider"/>
      
      <div class="loyalty-rewards-slider__item-options" v-if="props.options">
        <div
          v-for="(option, index) in props.options"
          class="loyalty-rewards-slider__item-option"
          :class="{'is-checked': option.checked}"
        >
          <div class="loyalty-rewards-slider__item-option-checkbox">
            <atomic-icon :id="option.checked ? 'check' : 'close'"/>
          </div>
          <div class="loyalty-rewards-slider__item-option-label">{{ option.label }}</div>
        </div>
      </div>
    
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    order: 'prev' | 'current' | 'next',
    number: number;
    name: string;
    image: string;
    statusPointsLabel: string;
    statusPointsValue: string;
    rankBonusLabel: string;
    rankBonusValue: string;
    rankBonusCurrency: string;
    cashBackLabel: string;
    cashBackValue: string;
    options: {
      label: string;
      checked: boolean;
    }[];
  }>();
  
  const orderClass = computed(() => `is-order-${props.order}`);
</script>

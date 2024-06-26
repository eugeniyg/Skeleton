<template>
  <div class="accumulated-rewards">
    <div class="accumulated-rewards__content">
      <div class="accumulated-rewards__content-label">Accumulated rewards:</div>

      <div class="accumulated-rewards__amount">
        <div class="accumulated-rewards__amount-current">
          <div class="accumulated-rewards__amount-value">0.00000013</div>
          <div class="accumulated-rewards__amount-currency">mBTC</div>
        </div>

        <div v-if="currencies" class="accumulated-rewards__list">
          <div class="accumulated-rewards__list-items">
            <div v-for="item in currencies" class="accumulated-rewards__list-item">
              <span class="accumulated-rewards__list-item-value">{{ item.value }}</span>
              <span class="accumulated-rewards__list-item-currency">{{ item.currency }}</span>
            </div>
          </div>

          <div
            v-if="hiddenItemsCount"
            class="accumulated-rewards__list-more"
            @click="showModal('questAccumulatedRewards')"
          >
            <span>+</span>
            <span>{{ hiddenItemsCount }}</span>
            <span>more</span>
          </div>
        </div>
      </div>
    </div>


    <div class="accumulated-rewards__img">
      <atomic-image src="/img/quest/quest-accumulated-rewards.png"/>
    </div>
  </div>
</template>

<script setup lang="ts">
const { showModal } = useLayoutStore();

const currencies = [
  { value: '1.000.000', currency: 'INR' },
  { value: '174', currency: 'PLN' },
  { value: '1.000.000', currency: 'GLD' }
];

const hiddenItemsCount = 3;
</script>

<style src="~/assets/styles/components/quest/accumulated-rewards.scss" lang="scss"/>
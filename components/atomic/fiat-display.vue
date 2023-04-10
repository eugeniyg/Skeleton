<template>
  <div
    class="fiat-display"
    :class="{ 'is-show-fiat-tooltip': isShowFiatTooltip }"
    @mouseenter="showFiatTooltip"
    @mouseleave="hideFiatTooltip"
  >
    <img class="fiat-display__logo" :src="`/img/currency/${ currency.code }.svg`" alt=""/>
    <span class="fiat-display__amount">{{ currency.amount }}</span>
    <span class="fiat-display__currency">{{ currency.code }}</span>

    <div class="fiat-display__tooltip">
      <img class="fiat-display__logo" :src="`/img/currency/${ crypto.code }.svg`" alt=""/>
      <span class="fiat-display__amount">{{ crypto.code }}</span>
      <span class="fiat-display__currency">{{ crypto.amount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const currency = {
    code: 'USD',
    amount: 137.37,
  };

  const crypto = {
    code: 'BTC',
    amount: '0.00000136',
  };

  const isShowFiatTooltip = ref<boolean>(false);

  const showFiatTooltip = () => {
    isShowFiatTooltip.value = true;
  };

  const hideFiatTooltip = () => {
    setTimeout(() => {
      isShowFiatTooltip.value = false;
    }, 1000);
  };
</script>

<style lang="scss">
.fiat-display {
  display: flex;
  position: relative;
  align-items: center;
  z-index: 1;
  column-gap: rem(4px);

  &.is-show-fiat-tooltip {
    --fiat-tooltip-opacity: 1;
    --fiat-tooltip-events: initial;

    .icon-expand {
      --icon-transform: rotate(-180deg);
      --color: var(--white);
    }
  }

  &__logo {
    display: block;
    @include box(20px);
  }

  &__amount {
    @include font($heading-2);
    color: var(--gray-500);
  }

  &__currency {
    @include font($heading-2);
    color: var(--gray-500);
  }

  &__tooltip {
    background-color: var(--layer-01);
    display: none;
    align-items: center;
    position: absolute;
    column-gap: 4px;
    padding: 0 16px;
    height: rem(40px);
    width: fit-content;
    transform: translateX(-50%);
    top: rem(34px);
    left: 50%;
    border-radius: 12px;
    opacity: var(--fiat-tooltip-opacity, 0);
    pointer-events: var(--fiat-tooltip-events, none);
    transition: all .4s ease-in-out;

    @include media(l) {
      display: flex;
    }
  }
}
</style>

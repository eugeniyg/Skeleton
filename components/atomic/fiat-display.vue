<template>
  <div
    class="fiat-display"
    :class="{ 'is-show-fiat-tooltip': isShowFiatTooltip && !props.showCurrencyPopup }"
    @mouseenter="showFiatTooltip"
    @mouseleave="hideFiatTooltip"
  >
    <img
      class="fiat-display__logo"
      :src="`/img/currency/${ activeAccount?.currency }.svg`"
      alt=""
    />
    <span class="fiat-display__amount">{{ equivalentBalanceFormat.amount }}</span>
    <span class="fiat-display__currency">{{ equivalentBalanceFormat.currency }}</span>

    <div class="fiat-display__tooltip">
      <img class="fiat-display__logo" :src="`/img/currency/${ activeAccount?.currency }.svg`" alt=""/>
      <span class="fiat-display__amount">{{ activeBalanceFormat.amount }}</span>
      <span class="fiat-display__currency">{{ activeBalanceFormat.currency }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    showCurrencyPopup: boolean
  }>();

  const walletStore = useWalletStore();
  const { activeAccount, activeEquivalentAccount } = storeToRefs(walletStore);
  const { formatBalance } = useProjectMethods();

  const equivalentBalanceFormat = computed(() => formatBalance(activeEquivalentAccount.value?.currency, activeEquivalentAccount.value?.balance));
  const activeBalanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));

  const isShowFiatTooltip = ref<boolean>(false);

  const showFiatTooltip = () => {
    if (props.showCurrencyPopup) return;
    isShowFiatTooltip.value = true;
  };

  const hideFiatTooltip = () => {
    isShowFiatTooltip.value = false;
  };

  watch(() => props.showCurrencyPopup, (newValue) => {
    if (newValue) hideFiatTooltip();
  });
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
    color: var(--white);
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

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

<style src="~/assets/styles/components/atomic/fiat-display.scss" lang="scss" />

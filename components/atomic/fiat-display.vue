<template>
  <div class="fiat-display">
    <atomic-image
      class="fiat-display__logo"
      :src="`/img/currency/${activeAccount?.currency}.svg`"
      default-image="/img/currency/placeholder.svg"
    />
    <span class="fiat-display__amount">{{ equivalentBalanceFormat.amount }}</span>
    <span class="fiat-display__currency">{{ equivalentBalanceFormat.currency }}</span>
  </div>
</template>

<script setup lang="ts">
  import { formatBalance } from '@skeleton/helpers/amountMethods';

  const walletStore = useWalletStore();
  const { activeAccount, activeEquivalentAccount } = storeToRefs(walletStore);

  const equivalentBalanceFormat = computed(() =>
    formatBalance(activeEquivalentAccount.value?.currency, activeEquivalentAccount.value?.balance)
  );
</script>

<style src="~/assets/styles/components/atomic/fiat-display.scss" lang="scss" />

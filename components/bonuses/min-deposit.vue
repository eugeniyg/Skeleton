<template>
  <div v-if="minDeposit" class="bonuses-min-deposit">
    <div class="bonuses-min-deposit__row">
      <span v-if="props.label" class="bonuses-min-deposit__label">{{ props.label }}:</span>
      <span class="bonuses-min-deposit__amount">{{ minDeposit.amount }}</span>
      <span class="bonuses-min-deposit__currency">{{ minDeposit.currency }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IAmountRangeItem, IBonus } from "@skeleton/core/types";

  const props = defineProps<{
    bonusInfo: IBonus;
    label?: string;
  }>();

  const { formatBalance, getEquivalentFromBase } = useProjectMethods();
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);

  const minDeposit = computed<{amount: number, currency: string }|undefined>(() => {
    let minDeposit: { amount: number, currency: string }|undefined;

    const invoiceItems: IAmountRangeItem[]|undefined = props.bonusInfo.triggerConditions?.invoiceAmountItems;
    const baseCurrencyInvoiceFrom = props.bonusInfo.triggerConditions?.baseCurrencyInvoiceAmountFrom;

    if (invoiceItems?.length) {
      const currentCurrencyInvoiceItem = invoiceItems.find(invoiceItem => invoiceItem.currency === activeAccount.value?.currency);
      if (currentCurrencyInvoiceItem && currentCurrencyInvoiceItem.amountFrom) {
        minDeposit = formatBalance(currentCurrencyInvoiceItem.currency, currentCurrencyInvoiceItem.amountFrom);
      }
    }

    if (!minDeposit && baseCurrencyInvoiceFrom) {
      minDeposit = getEquivalentFromBase(baseCurrencyInvoiceFrom, activeAccount.value?.currency);
    }

    return minDeposit;
  })
</script>

<style src="~/assets/styles/components/bonuses/min-deposit.scss" lang="scss"/>
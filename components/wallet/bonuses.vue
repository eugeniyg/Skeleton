<template>
  <div class="wallet-bonuses">
    <atomic-divider/>

    <div class="wallet-bonuses__title">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.title') }}
    </div>

    <template v-for="bonus in bonusesList" :key="bonus.id">
      <wallet-bonus
        :bonusInfo="bonus"
        :selected="selectedDepositBonus?.id === bonus.id"
        :disabled="!!props.amount && !!bonus.minDeposit && props.amount < bonus.minDeposit.amount"
        @bonusChange="onBonusChange(bonus)"
      />
    </template>

    <div v-if="props.crypto" class="wallet-bonuses__info">
      <div class="wallet-bonuses__info-icon">
        <atomic-icon id="info" />
      </div>

      <div class="wallet-bonuses__info-description">
        {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.infoDescription') }}
      </div>
    </div>

    <atomic-divider />
  </div>
</template>

<script setup lang="ts">
  import {storeToRefs} from "pinia";
  import { IBonus } from "@skeleton/core/types";

  const props = defineProps<{
    crypto?: boolean;
    amount?: number|string;
  }>();

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent, formatBalance, getEquivalentFromBase } = useProjectMethods();
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);

  const bonusStore = useBonusStore();
  const { depositBonuses, selectedDepositBonus } = storeToRefs(bonusStore);
  const bonusesList = computed(() => {
    return depositBonuses.value.map(bonus => {
      let minDeposit: { amount: number, currency: string }|undefined;
      const invoiceItems = bonus.triggerConditions?.invoiceAmountItems;
      const baseCurrencyInvoiceFrom = bonus.triggerConditions?.baseCurrencyInvoiceAmountFrom;

      if (invoiceItems?.length) {
        const currentCurrencyInvoiceItem = invoiceItems.find(invoiceItem => invoiceItem.currency === activeAccount.value?.currency);
        if (currentCurrencyInvoiceItem && currentCurrencyInvoiceItem.amountFrom) {
          minDeposit = formatBalance(currentCurrencyInvoiceItem.currency, currentCurrencyInvoiceItem.amountFrom);
        }
      }

      if (!minDeposit && baseCurrencyInvoiceFrom) {
        minDeposit = getEquivalentFromBase(baseCurrencyInvoiceFrom, activeAccount.value?.currency);
      }

      return { ...bonus, minDeposit };
    })
  })

  if (props.amount || props.amount === 0) {
    selectedDepositBonus.value = bonusesList.value.find(bonus => !bonus.minDeposit || (bonus.minDeposit.amount <= Number(props.amount)));
  } else {
    selectedDepositBonus.value = bonusesList.value[0];
  }

  const onBonusChange = (bonus: IBonus): void => {
    if (selectedDepositBonus.value?.id === bonus.id) selectedDepositBonus.value = undefined;
    else selectedDepositBonus.value = bonus;
  }

  watch(() => props.amount, () => {
    if (
      (props.amount || props.amount === 0)
      && selectedDepositBonus.value?.minDeposit
      && Number(props.amount) < selectedDepositBonus.value.minDeposit.amount
    ) {
      selectedDepositBonus.value = undefined;
    }
  })
</script>

<style src="~/assets/styles/components/wallet/bonuses.scss" lang="scss"/>
<template>
  <div class="wallet-bonuses">
    <div class="wallet-bonuses__title">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.title') }}
    </div>

    <template v-for="bonus in bonusesList" :key="bonus.id">
      <wallet-bonus
        :bonusInfo="bonus"
        :selected="selectedDepositBonus?.id === bonus.id"
        :disabled="!props.crypto && isBonusDisabled(bonus)"
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
      let maxDeposit: { amount: number, currency: string }|undefined;
      const invoiceItems = bonus.triggerConditions?.invoiceAmountItems;
      const baseCurrencyInvoiceFrom = bonus.triggerConditions?.baseCurrencyInvoiceAmountFrom;
      const baseCurrencyInvoiceTo = bonus.triggerConditions?.baseCurrencyInvoiceAmountTo;

      if (invoiceItems?.length) {
        const currentCurrencyInvoiceItem = invoiceItems.find(invoiceItem => invoiceItem.currency === activeAccount.value?.currency);
        if (currentCurrencyInvoiceItem && currentCurrencyInvoiceItem.amountFrom) {
          minDeposit = formatBalance(currentCurrencyInvoiceItem.currency, currentCurrencyInvoiceItem.amountFrom);
        }
        if (currentCurrencyInvoiceItem && currentCurrencyInvoiceItem.amountTo) {
          maxDeposit = formatBalance(currentCurrencyInvoiceItem.currency, currentCurrencyInvoiceItem.amountTo);
        }
      }

      if (!minDeposit && baseCurrencyInvoiceFrom) {
        minDeposit = getEquivalentFromBase(baseCurrencyInvoiceFrom, activeAccount.value?.currency);
      }

      if (!maxDeposit && baseCurrencyInvoiceTo) {
        maxDeposit = getEquivalentFromBase(baseCurrencyInvoiceTo, activeAccount.value?.currency);
      }

      return { ...bonus, minDeposit, maxDeposit };
    })
  })

  const getStorageBonus = (): IBonus|undefined => {
    const storageDepositDataString = sessionStorage.getItem('depositBonusData');
    const storageDepositData = storageDepositDataString ? JSON.parse(storageDepositDataString) : undefined;

    if (storageDepositData && storageDepositData.currency === activeAccount.value?.currency) {
      return bonusesList.value.find(bonus => bonus.id === storageDepositData.bonusId);
    }

    return undefined;
  }

  const isBonusDisabled = (bonusData: IBonus): boolean => {
    if (bonusData.minDeposit && bonusData.maxDeposit) {
      return Number(props.amount) < bonusData.minDeposit.amount || Number(props.amount) > bonusData.maxDeposit.amount;
    } else if (bonusData.minDeposit) {
      return Number(props.amount) < bonusData.minDeposit.amount;
    } else if (bonusData.maxDeposit) {
      return Number(props.amount) > bonusData.maxDeposit.amount;
    }

    return false;
  }

  const storageBonus = getStorageBonus();
  if (!props.crypto) {
    const bonusByDeposit = bonusesList.value.find(bonus => !isBonusDisabled(bonus));
    selectedDepositBonus.value = storageBonus || bonusByDeposit;
  } else {
    selectedDepositBonus.value = storageBonus || bonusesList.value[0];
  }

  const onBonusChange = (bonus: IBonus): void => {
    if (selectedDepositBonus.value?.id === bonus.id) {
      selectedDepositBonus.value = undefined;
      sessionStorage.removeItem('depositBonus');
    } else {
      selectedDepositBonus.value = bonus;
      sessionStorage.setItem('depositBonusData', JSON.stringify({
        bonusId: bonus.id,
        amount: props.amount,
        currency: activeAccount.value?.currency
      }));
    }
  }

  watch(() => props.amount, () => {
    if (selectedDepositBonus.value && isBonusDisabled(selectedDepositBonus.value)) {
      selectedDepositBonus.value = undefined;
    }
  })
</script>

<style src="~/assets/styles/components/wallet/bonuses.scss" lang="scss"/>
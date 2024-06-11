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

    <div class="wallet-bonus wallet-bonuses__decline" :class="{ 'is-selected': bonusDeclined }">
      <div class="wallet-bonus__content">
        <div class="wallet-bonus__title">
          <atomic-icon id="bonus-declined" />

          <span>
            {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.declineLabel') }}
          </span>
        </div>

        <form-input-checkbox
          name="bonus-decline"
          :value="bonusDeclined"
          @change="declineBonuses"
        />
      </div>
    </div>

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
  import { storeToRefs } from "pinia";
  import type { IBonus, IBonusPackage } from "@skeleton/core/types";

  const props = defineProps<{
    crypto?: boolean;
    amount?: string;
  }>();

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent, formatBalance, getEquivalentFromBase } = useProjectMethods();
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const bonusStore = useBonusStore();
  const { depositBonuses, selectedDepositBonus, bonusDeclined } = storeToRefs(bonusStore);

  const sortBonuses = (prevBonus: IBonus, nextBonus: IBonus): number => {
    if (prevBonus.type === 2 || (prevBonus.type === 1 && nextBonus.type === 3)) return -1;
    if (nextBonus.type === 2 || (prevBonus.type === 3 && nextBonus.type === 1)) return 1;
    else return 0;
  }

  const setDepositLimit = (bonusData: IBonus): IBonus => {
    let minDeposit: { amount: number, currency: string }|undefined;
    let maxDeposit: { amount: number, currency: string }|undefined;

    const invoiceItems = bonusData.triggerConditions?.invoiceAmountItems;
    const baseCurrencyInvoiceFrom = bonusData.triggerConditions?.baseCurrencyInvoiceAmountFrom;
    const baseCurrencyInvoiceTo = bonusData.triggerConditions?.baseCurrencyInvoiceAmountTo;

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

    return { ...bonusData, minDeposit, maxDeposit };
  }

  interface IPackageBonus {
    package: IBonusPackage;
    items: IBonus[];
  }

  const bonusesList = computed(() => {
    const packages: IPackageBonus[] = [];
    const simpleBonuses: IBonus[] = [];

    depositBonuses.value.forEach(currentBonus => {
      const bonusWithLimits = setDepositLimit(currentBonus);

      if (bonusWithLimits.package?.id) {
        const packageBonus = packages.find(bonus => bonus.package?.id === bonusWithLimits.package?.id);

        if (packageBonus) {
          packageBonus.items = [...packageBonus.items, bonusWithLimits].sort((prevItem, nextItem) => sortBonuses(prevItem, nextItem));
        } else {
          packages.push({ package: bonusWithLimits.package, items: [bonusWithLimits] });
        }
      } else {
        simpleBonuses.push(bonusWithLimits);
      }
    })

    packages.sort((prevPackage, nextPackage) => {
      if (prevPackage.items[0].type === 2 || (prevPackage.items[0].type === 1 && nextPackage.items[0].type === 3)) return -1;
      if (nextPackage.items[0].type === 2 || (prevPackage.items[0].type === 3 && nextPackage.items[0].type === 1)) return 1;
      else return 0;
    })

    simpleBonuses.sort((prevBonus, nextBonus) => sortBonuses(prevBonus, nextBonus));

    const packageBonuses = packages.map(currentPackage => ({
      ...currentPackage.items[0],
      packageItems: currentPackage.items
    }))

    return [...packageBonuses, ...simpleBonuses];
  })

  const getStorageBonus = (): IBonus|undefined => {
    const storageDepositDataString = sessionStorage.getItem('depositBonusData');
    const storageDepositData = storageDepositDataString ? JSON.parse(storageDepositDataString) : undefined;

    if (storageDepositData) {
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
  if (sessionStorage.getItem('bonusDeclined')) {
    bonusDeclined.value = true;
    selectedDepositBonus.value = undefined;
  } else if (!props.crypto) {
    const bonusByDeposit = bonusesList.value.find(bonus => !isBonusDisabled(bonus));
    selectedDepositBonus.value = storageBonus || bonusByDeposit;
  } else {
    selectedDepositBonus.value = storageBonus || bonusesList.value[0];
  }

  const declineBonuses = (): void => {
    if (bonusDeclined.value) return;

    bonusDeclined.value = true;
    selectedDepositBonus.value = undefined;
    sessionStorage.removeItem('depositBonusData');
    sessionStorage.setItem('bonusDeclined', 'true');
    useEvent('analyticsEvent', { event: 'walletDeclineBonuses' });
  }

  const onBonusChange = (bonus: IBonus): void => {
    if (selectedDepositBonus.value?.id === bonus.id) {
      selectedDepositBonus.value = undefined;
      sessionStorage.removeItem('depositBonusData');
    } else {
      selectedDepositBonus.value = bonus;
      bonusDeclined.value = false;
      sessionStorage.removeItem('bonusDeclined');
      sessionStorage.setItem('depositBonusData', JSON.stringify({
        bonusId: bonus.id,
        amount: props.amount,
        currency: activeAccount.value?.currency
      }));
      useEvent('analyticsEvent', { event: 'walletSelectBonus'});
    }
  }

  watch(() => props.amount, () => {
    if (selectedDepositBonus.value && isBonusDisabled(selectedDepositBonus.value)) {
      selectedDepositBonus.value = undefined;
    }
  })
</script>

<style src="~/assets/styles/components/wallet/bonuses.scss" lang="scss"/>
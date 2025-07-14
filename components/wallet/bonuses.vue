<template>
  <div class="wallet-bonuses">
    <div class="wallet-bonuses__header">
      <div class="wallet-bonuses__title">
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.bonuses.title') }}
      </div>

      <form-input-toggle
        class="wallet-bonuses__decline"
        name="bonus-decline"
        :value="bonusDeclined"
        @change="declineBonuses"
      >
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.bonuses.declineLabel') }}
      </form-input-toggle>
    </div>

    <template v-for="bonus in bonusesList" :key="bonus.id">
      <wallet-bonus
        :bonus-info="bonus"
        :selected="checkSelected(bonus)"
        :disabled="!props.crypto && isBonusDisabled(bonus)"
        @bonus-change="onBonusChange(bonus)"
      />
    </template>

    <bonuses-deposit-promo ref="depositCode" @open-bonus-code="bonusCodeTrigger" />

    <div v-if="props.crypto" class="wallet-bonuses__info">
      <div class="wallet-bonuses__info-icon">
        <atomic-icon id="info" />
      </div>

      <div
        class="wallet-bonuses__info-description"
        v-html="DOMPurify.sanitize(marked.parseInline(cryptoInfoContent || '') as string, { FORBID_TAGS: ['style'] })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBonus } from '@skeleton/api/types';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  import type { IWalletModal } from '~/types';
  import { formatBalance, getEquivalentFromBase } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    crypto?: boolean;
    amount?: string;
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const { settingsConstants } = useGlobalStore();
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const bonusStore = useBonusStore();
  const {
    depositBonuses,
    selectedDepositBonus,
    bonusDeclined,
    depositBonusCode,
    showDepositBonusCode,
    walletDepositBonus,
  } = storeToRefs(bonusStore);

  const cryptoInfoContent = getContent(walletContent, defaultLocaleWalletContent, 'deposit.bonuses.infoDescription');

  const setDepositLimit = (bonusData: IBonus): IBonus => {
    let minDeposit: { amount: number; currency: string } | undefined;
    let maxDeposit: { amount: number; currency: string } | undefined;

    const invoiceItems = bonusData.triggerConditions?.invoiceAmountItems;
    const baseCurrencyInvoiceFrom = bonusData.triggerConditions?.baseCurrencyInvoiceAmountFrom;
    const baseCurrencyInvoiceTo = bonusData.triggerConditions?.baseCurrencyInvoiceAmountTo;

    if (invoiceItems?.length) {
      const currentCurrencyInvoiceItem = invoiceItems.find(
        invoiceItem => invoiceItem.currency === activeAccount.value?.currency
      );
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
  };

  const bonusesList = computed(() => {
    const bonusesList: IBonus[] = [];

    depositBonuses.value.forEach(currentBonus => {
      const bonusWithLimits = setDepositLimit(currentBonus);

      if (bonusWithLimits.package?.id) {
        const bonusInList = bonusesList.find(bonus => bonus.package?.id === bonusWithLimits.package?.id);

        if (bonusInList) bonusInList.packageItems?.push(bonusWithLimits);
        else bonusesList.push({ ...bonusWithLimits, packageItems: [bonusWithLimits] });
      } else {
        bonusesList.push(bonusWithLimits);
      }
    });

    return bonusesList;
  });

  const isBonusDisabled = (bonusData: IBonus): boolean => {
    if (bonusData.minDeposit && bonusData.maxDeposit) {
      return Number(props.amount) < bonusData.minDeposit.amount || Number(props.amount) > bonusData.maxDeposit.amount;
    } else if (bonusData.minDeposit) {
      return Number(props.amount) < bonusData.minDeposit.amount;
    } else if (bonusData.maxDeposit) {
      return Number(props.amount) > bonusData.maxDeposit.amount;
    }

    return false;
  };

  const depositCode = ref();
  const bonusCodeTrigger = async (): Promise<void> => {
    selectedDepositBonus.value = undefined;
    bonusDeclined.value = false;
    showDepositBonusCode.value = true;
    useEvent('analyticsEvent', { event: 'walletPromoOpen' });
    await nextTick();
    depositCode.value.$el.scrollIntoView({ behavior: 'smooth' });
  };

  const configDeclineBonuses = settingsConstants?.game?.bonus?.depositBonusDeclineDefault;
  if (walletDepositBonus.value?.id) {
    const findBonus = walletDepositBonus.value.packageId
      ? bonusesList.value.find(bonus => bonus.package?.id === walletDepositBonus.value?.packageId)
      : bonusesList.value.find(bonus => bonus.id === walletDepositBonus.value?.id);
    selectedDepositBonus.value = findBonus;
    bonusDeclined.value = !findBonus;
    showDepositBonusCode.value = !findBonus && !!depositBonusCode.value;
  } else if (depositBonusCode.value) {
    selectedDepositBonus.value = undefined;
    bonusDeclined.value = false;
    showDepositBonusCode.value = true;
  } else if (configDeclineBonuses) {
    selectedDepositBonus.value = undefined;
    bonusDeclined.value = true;
    showDepositBonusCode.value = false;
  } else {
    selectedDepositBonus.value = !props.crypto
      ? bonusesList.value.find(bonus => !isBonusDisabled(bonus))
      : bonusesList.value[0];
    bonusDeclined.value = !selectedDepositBonus.value;
    showDepositBonusCode.value = false;
  }

  const bonusDeclinedManually = ref(false);
  const declineBonuses = (): void => {
    if (bonusDeclined.value) return;

    bonusDeclined.value = true;
    bonusDeclinedManually.value = true;
    selectedDepositBonus.value = undefined;
    showDepositBonusCode.value = false;
    useEvent('analyticsEvent', { event: 'walletDeclineBonuses' });
  };

  const onBonusChange = (bonus: IBonus): void => {
    if (selectedDepositBonus.value?.id === bonus.id) return;
    else {
      selectedDepositBonus.value = bonus;
      bonusDeclined.value = false;
      useEvent('analyticsEvent', { event: 'walletSelectBonus' });
      showDepositBonusCode.value = false;
    }
  };

  const checkSelected = (bonus: IBonus): boolean => {
    return (
      selectedDepositBonus.value?.id === bonus.id ||
      (!!selectedDepositBonus.value?.package?.id && selectedDepositBonus.value.package.id === bonus.package?.id)
    );
  };

  watch(
    () => props.amount,
    () => {
      if (selectedDepositBonus.value && isBonusDisabled(selectedDepositBonus.value)) {
        if (configDeclineBonuses) {
          selectedDepositBonus.value = undefined;
          bonusDeclined.value = true;
        } else {
          bonusDeclinedManually.value = false;
          selectedDepositBonus.value = bonusesList.value.find(bonus => !isBonusDisabled(bonus));
          bonusDeclined.value = !selectedDepositBonus.value;
        }
      } else if (!showDepositBonusCode.value && !selectedDepositBonus.value && !bonusDeclinedManually.value) {
        selectedDepositBonus.value = bonusesList.value.find(bonus => !isBonusDisabled(bonus));
        bonusDeclined.value = !selectedDepositBonus.value;
      }
    }
  );
</script>

<style src="~/assets/styles/components/wallet/bonuses.scss" lang="scss" />

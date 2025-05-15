<template>
  <vue-final-modal
    class="modal-package-bonus"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('package-bonus')"
  >
    <div class="scroll">
      <div class="header">
        <div>
          <div v-if="bonusValue" class="header__title">
            {{ bonusesList[0].packageName || bonusesList[0].package.name }}
          </div>

          <div class="header__value">
            {{ bonusValue || bonusesList[0].packageName || bonusesList[0].package.name }}
          </div>
        </div>

        <button-modal-close @close="closeModal('package-bonus')" />
      </div>

      <div class="modal-package-bonus__list">
        <bonuses-card
          v-for="bonus in filteredList"
          :key="bonus.id + bonus.status"
          :bonus-info="bonus"
          :is-cash="bonus.isCash"
          :is-free-spin="bonus.isFreeSpin"
          :is-deposit="bonus.isDeposit"
          :loading="props.loadingBonuses.includes(bonus.id)"
          @remove="removeHandle(bonus)"
          @activate="activateHandle(bonus)"
          @gameOpened="closeModal('package-bonus')"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';

  const props = defineProps<{
    loadingBonuses: string[];
    bonusesList: Record<string, any>[];
  }>();

  const { closeModal } = useModalStore();
  const emit = defineEmits(['activateBonus', 'activateFreeSpin', 'removeBonus', 'removeFreeSpin', 'activateDeposit']);

  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);

  const { formatBalance, getEquivalentFromBase } = useProjectMethods();

  const filteredList = computed(() => props.bonusesList.filter(bonus => [1, 2].includes(bonus.status)));

  const removeHandle = (bonus: Record<string, any>): void => {
    if (bonus.isFreeSpin) {
      emit('removeFreeSpin', bonus);
    } else if (bonus.isCash) {
      emit('removeBonus', bonus);
    }
  };

  const activateHandle = (bonus: Record<string, any>): void => {
    if (bonus.isFreeSpin) {
      emit('activateFreeSpin', bonus);
    } else if (bonus.isCash) {
      emit('activateBonus', bonus);
    } else if (bonus.isDeposit) {
      emit('activateDeposit', { depositBonus: props.bonusesList[0], loadingId: bonus.id });
    }
  };

  const getCahBonusValue = (bonusInfo: Record<string, any>): { amount: number; currency: string } => {
    const amountItems = bonusInfo.assignConditions?.amountItems;
    const amountBase = bonusInfo.assignConditions?.baseCurrencyAmount;
    const exclusionItem = amountItems?.find(item => item.currency === activeAccount.value?.currency);
    if (exclusionItem) return formatBalance(exclusionItem.currency, exclusionItem.amount);
    if (amountBase) return getEquivalentFromBase(amountBase, activeAccount.value?.currency);
    return { amount: 0, currency: activeAccount.value?.currency || '' };
  };

  const bonusValue = computed(() => {
    let cashBonusAmount: number = 0;
    let freeSpinAmount: number = 0;
    let formatCurrency: string | undefined;

    filteredList.value.forEach(bonus => {
      if (bonus.isFreeSpin) freeSpinAmount += bonus.count;
      else if (bonus.isCash) {
        const { amount, currency } = formatBalance(bonus.currency, bonus.amount);
        cashBonusAmount += amount;
        formatCurrency = currency;
      } else if (bonus.isDeposit && bonus.type === 3) {
        freeSpinAmount += bonus.assignConditions?.presets?.[0].quantity;
      } else if (bonus.isDeposit && bonus.type === 1) {
        const { amount, currency } = getCahBonusValue(bonus);
        cashBonusAmount += amount;
        formatCurrency = currency;
      }
    });

    let result: string = '';

    if (cashBonusAmount && formatCurrency) {
      const amountValue = Number(cashBonusAmount.toFixed(activeAccountType.value === 'fiat' ? 2 : 8));
      result = `${amountValue} ${formatCurrency}`;
    }

    if (freeSpinAmount) result += result ? ` + ${freeSpinAmount} FS` : `${freeSpinAmount} FS`;
    return result;
  });
</script>

<style src="~/assets/styles/components/modal/package-bonus.scss" lang="scss" />

<template>
  <div
    class="wallet-bonus"
    :class="{
      [`wallet-bonus--bg-${mappingBonusColor[props.bonusInfo.type]}`]: props.selected,
      'is-selected': props.selected,
      'wallet-bonus--disabled': props.disabled
    }"
  >
    <div class="wallet-bonus__content">
      <div class="wallet-bonus__title">
        {{ props.bonusInfo.name }}
      </div>

      <div
        v-if="props.bonusInfo.minDeposit || props.bonusInfo.maxDeposit"
        class="wallet-bonus__min"
        @click="openBonusDetails"
      >
        <atomic-icon id="info" />

        <div class="wallet-bonus__min-title">
          {{ bonusDepositContent.label }}
        </div>

        <div class="wallet-bonus__min-value">
          {{ bonusDepositContent.value }}
        </div>
      </div>

      <div
        v-else
        class="wallet-bonus__more"
        @click="openBonusDetails"
      >
        <div class="wallet-bonus__more-title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.moreInfo') }}
        </div>

        <atomic-icon id="info" />
      </div>

      <form-input-checkbox
        :name="`${props.bonusInfo.id}`"
        :value="props.selected"
        @change="emit('bonusChange', props.bonusInfo.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBonus } from "@skeleton/core/types";
  import { storeToRefs } from "pinia";

  const props = defineProps<{
    bonusInfo: IBonus;
    selected: boolean;
    disabled: boolean;
  }>();

  const emit = defineEmits(['bonusChange']);

  const { showModal } = useLayoutStore();
  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const bonusStore = useBonusStore();
  const { depositMoreInfoBonus } = storeToRefs(bonusStore);

  const mappingBonusColor = {
    1: 'cash',
    2: 'percentage',
    3: 'freespin'
  }

  const bonusDepositContent = computed(() => {
    const minDepositData = props.bonusInfo.minDeposit;
    const maxDepositData = props.bonusInfo.maxDeposit;
    let label;
    let value;

    if (minDepositData && maxDepositData) {
      label = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.deposit.bonuses.deposit');
      value = `${minDepositData.amount} ${minDepositData.currency} - ${maxDepositData.amount} ${maxDepositData.currency}`;
    } else if (minDepositData) {
      label = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.deposit.bonuses.minDeposit');
      value = `${minDepositData.amount} ${minDepositData.currency}`;
    } else if (maxDepositData) {
      label = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.deposit.bonuses.maxDeposit');
      value = `${maxDepositData.amount} ${maxDepositData.currency}`;
    }

    return { label, value };
  })

  const openBonusDetails = (): void => {
    depositMoreInfoBonus.value = props.bonusInfo;
    showModal('walletBonusDetails')
  }
</script>

<style src="~/assets/styles/components/wallet/bonus.scss" lang="scss"/>
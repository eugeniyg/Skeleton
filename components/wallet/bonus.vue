<template>
  <div
    class="wallet-bonus"
    :class="classes"
  >
    <div class="wallet-bonus__content">
      <div class="wallet-bonus__title">
        {{ props.bonusInfo.package?.name || props.bonusInfo.name }}
      </div>

      <div
        v-if="props.bonusInfo.minDeposit || props.bonusInfo.maxDeposit"
        class="wallet-bonus__min"
        @click.stop="openBonusDetails"
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
        @click.stop="openBonusDetails"
      >
        <div class="wallet-bonus__more-title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.moreInfo') }}
        </div>

        <atomic-icon id="info" />
      </div>
      
      <form-input-bonus-radio
        name="input-bonus-radio"
        :id="props.bonusInfo.id"
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
  const bonusStore = useBonusStore();
  const { depositMoreInfoBonus } = storeToRefs(bonusStore);

  const classes = computed(() => ({
    'is-selected': props.selected,
    'wallet-bonus--disabled': props.disabled
  }))

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

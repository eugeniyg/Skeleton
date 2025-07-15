<template>
  <div class="wallet-bonus" :class="classes" @click="handleBonusClick">
    <div class="wallet-bonus__content">
      <div class="wallet-bonus__title">
        {{ props.bonusInfo.package?.name || props.bonusInfo.name }}
      </div>

      <div
        v-if="props.bonusInfo.minDeposit || props.bonusInfo.maxDeposit"
        class="wallet-bonus__min"
        @click.stop="openBonusInfoModal"
      >
        <atomic-icon id="info" />

        <div class="wallet-bonus__min-title">
          {{ bonusDepositContent.label }}
        </div>

        <div class="wallet-bonus__min-value">
          {{ bonusDepositContent.value }}
        </div>
      </div>

      <div v-else class="wallet-bonus__more" @click.stop="openBonusInfoModal">
        <div class="wallet-bonus__more-title">
          {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.bonuses.moreInfo') }}
        </div>

        <atomic-icon id="info" />
      </div>

      <form-input-bonus-radio :id="props.bonusInfo.id" name="input-bonus-radio" :value="props.selected" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBonus } from '@skeleton/api/types';
  import type { IWalletModal } from '~/types';

  const props = defineProps<{
    bonusInfo: IBonus;
    selected: boolean;
    disabled: boolean;
  }>();

  const emit = defineEmits(['bonusChange']);

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const { openModal } = useModalStore();
  const bonusStore = useBonusStore();
  const { depositMoreInfoBonus } = storeToRefs(bonusStore);

  const classes = computed(() => ({
    'is-selected': props.selected,
    'wallet-bonus--disabled': props.disabled,
  }));

  const bonusDepositContent = computed(() => {
    const minDepositData = props.bonusInfo.minDeposit;
    const maxDepositData = props.bonusInfo.maxDeposit;
    let label;
    let value;

    if (minDepositData && maxDepositData) {
      label = getContent(walletContent, defaultLocaleWalletContent, 'deposit.bonuses.deposit');
      value = `${minDepositData.amount} ${minDepositData.currency} - ${maxDepositData.amount} ${maxDepositData.currency}`;
    } else if (minDepositData) {
      label = getContent(walletContent, defaultLocaleWalletContent, 'deposit.bonuses.minDeposit');
      value = `${minDepositData.amount} ${minDepositData.currency}`;
    } else if (maxDepositData) {
      label = getContent(walletContent, defaultLocaleWalletContent, 'deposit.bonuses.maxDeposit');
      value = `${maxDepositData.amount} ${maxDepositData.currency}`;
    }

    return { label, value };
  });

  const openBonusInfoModal = (): void => {
    depositMoreInfoBonus.value = props.bonusInfo;
    openModal('wallet-bonus-info');
  };

  const handleBonusClick = (): void => {
    if (props.disabled || props.selected) return;
    emit('bonusChange');
  };
</script>

<style src="~/assets/styles/components/wallet/bonus.scss" lang="scss" />

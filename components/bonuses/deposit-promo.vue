<template>
  <div class="bonuses-deposit-promo" :class="{ 'is-selected': showDepositBonusCode }" @click="handleBonusClick">
    <form-input-bonus-radio
      id="deposit-bonus-code"
      name="input-deposit-bonus-code"
      :value="showDepositBonusCode"
      @change="emit('openBonusCode')"
    />

    <div class="bonuses-deposit-promo__head">
      <atomic-icon id="bonuses" />
      {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.togglerLabel') || '' }}
    </div>

    <div v-if="showDepositBonusCode" class="bonuses-deposit-promo__code">
      <form-input-text
        ref="bonusField"
        v-model:value="bonusValue"
        label=""
        :placeholder="
          getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.bonusCode.placeholder') || ''
        "
        name="bonus-code"
        autocomplete="off"
        :is-disabled="!!depositBonusCode"
        @touchend="focusInput"
        @touchmove="touchMove = true"
      />

      <button-base type="secondary" size="md" :is-disabled="bonusChecking || !bonusValue" @click="toggleBonusCode">
        <atomic-spinner :is-shown="bonusChecking" />
        {{
          depositBonusCode
            ? getContent(walletContent, defaultLocaleWalletContent, 'deposit.cancelBonusCode')
            : getContent(walletContent, defaultLocaleWalletContent, 'deposit.addBonusCode')
        }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IWalletModal } from '~/types';

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const emit = defineEmits(['openBonusCode']);
  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings } = globalStore;
  const { getContent } = useProjectMethods();

  const bonusValue = ref<string>('');
  const bonusChecking = ref<boolean>(false);

  const { addBonusCode, deleteBonusCode } = useCoreBonusApi();
  const bonusStore = useBonusStore();
  const { showDepositBonusCode, depositBonusCode } = storeToRefs(bonusStore);

  const sendManualBonus = async (): Promise<boolean> => {
    try {
      const response = await addBonusCode(bonusValue.value, 1);
      return response.status === 2;
    } catch {
      return false;
    }
  };

  const toggleBonusCode = async (): Promise<void> => {
    if (bonusChecking.value) return;
    bonusChecking.value = true;

    if (depositBonusCode.value) {
      await deleteBonusCode(depositBonusCode.value?.id as string);
      bonusValue.value = '';
      depositBonusCode.value = undefined;
    } else if (bonusValue.value) {
      useEvent('analyticsEvent', { event: 'walletPromoSubmit' });

      const bonusActivated = await sendManualBonus();
      if (bonusActivated) {
        bonusValue.value = '';
        depositBonusCode.value = undefined;
      } else {
        depositBonusCode.value = await addBonusCode(bonusValue.value, 3);
      }
    }

    bonusChecking.value = false;
  };

  const closeBonusField = async (): Promise<void> => {
    if (depositBonusCode.value) {
      toggleBonusCode();
    } else {
      bonusValue.value = '';
    }
  };

  const bonusField = ref();
  const touchMove = ref<boolean>(false);
  const focusInput = (): void => {
    if (!globalStore.isIOSPlatform) return;

    if (touchMove.value) {
      touchMove.value = false;
      return;
    }

    const inputElement: HTMLInputElement = bonusField.value.$el.querySelector('input');
    if (inputElement) inputElement.focus();
  };

  const handleBonusClick = (): void => {
    if (showDepositBonusCode.value) return;
    emit('openBonusCode');
  };

  watch(
    () => showDepositBonusCode.value,
    newValue => {
      if (!newValue && bonusValue.value) {
        closeBonusField();
      }
    }
  );

  onMounted(() => {
    if (depositBonusCode.value) {
      bonusValue.value = depositBonusCode.value?.bonusCode || '';
    }
  });
</script>

<style src="~/assets/styles/components/bonuses/deposit-promo.scss" lang="scss" />

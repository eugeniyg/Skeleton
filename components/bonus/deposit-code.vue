<template>
  <div class="deposit-bonus-code" :class="{ 'is-selected': showDepositBonusCode }">
    <form-input-bonus-radio
      id="deposit-bonus-code"
      name="input-deposit-bonus-code"
      :value="showDepositBonusCode"
      @change="emit('openBonusCode')"
    />

    <div class="deposit-bonus-code__head">
      <atomic-icon id="bonuses" />
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.togglerLabel') || '' }}
    </div>

    <div v-if="showDepositBonusCode" class="deposit-bonus-code__code">
      <form-input-text
        ref="bonusField"
        v-model:value="bonusValue"
        label=""
        :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.bonusCode.placeholder') || ''"
        name="bonus-code"
        autocomplete="off"
        :isDisabled="!!depositBonusCode"
        @touchend="focusInput"
        @touchmove="touchMove = true"
      />

      <button-base
        type="secondary"
        size="md"
        :isDisabled="bonusChecking || !bonusValue"
        @click="toggleBonusCode"
      >
        <atomic-spinner :is-shown="bonusChecking"/>
        {{ depositBonusCode ? getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.cancelBonusCode')
          : getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.addBonusCode') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const emit = defineEmits(['openBonusCode']);
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    fieldsSettings,
    defaultLocaleFieldsSettings
  } = globalStore;
  const { getContent } = useProjectMethods();

  const bonusValue = ref<string>('');
  const bonusChecking = ref<boolean>(false);

  const { addBonusCode, deleteBonusCode } = useCoreBonusApi();
  const bonusStore = useBonusStore();
  const { showDepositBonusCode, depositBonusCode } = storeToRefs(bonusStore);

  const sendManualBonus = async ():Promise<boolean> => {
    try {
      const response = await addBonusCode(bonusValue.value, 1);
      return response.status === 2;
    } catch (err: any) {
      return false;
    }
  };

  const toggleBonusCode = async ():Promise<void> => {
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

  const closeBonusField = async ():Promise<void> => {
    if (depositBonusCode.value) {
      toggleBonusCode();
    } else {
      bonusValue.value = '';
    }
  };

  const bonusField = ref();
  const touchMove = ref<boolean>(false);
  const focusInput = ():void => {
    if (!globalStore.isIOSPlatform) return;

    if (touchMove.value) {
      touchMove.value = false;
      return;
    }

    const inputElement: HTMLInputElement = bonusField.value.$el.querySelector('input');
    if (inputElement) inputElement.focus();
  };

  watch(() => showDepositBonusCode.value, (newValue) => {
    if (!newValue && bonusValue.value) {
      closeBonusField();
    }
  });

  onMounted(() => {
    if (depositBonusCode.value) {
      bonusValue.value = depositBonusCode.value?.bonusCode || '';
    }
  });
</script>

<style src="~/assets/styles/components/bonus/deposit-code.scss" lang="scss" />

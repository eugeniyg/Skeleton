<template>
  <div ref="root" class="deposit-bonus-code">
    <form-input-toggle
      name="bonus-toggle"
      v-model:value="hasBonusCode"
      @change="toggleBonusField"
    >
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.togglerLabel') || '' }}
    </form-input-toggle>

    <div v-if="hasBonusCode" class="deposit-bonus-code__code">
      <form-input-text
        v-model:value="bonusValue"
        ref="bonusField"
        label=""
        :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.bonusCode.placeholder') || ''"
        name="bonus-code"
        autocomplete="off"
        :isDisabled="!!depositBonusCode"
        @touchend="focusInput"
        @touchmove="touchMove = true"
      />

      <button-base
        type="primary"
        size="md"
        @click="toggleBonusCode"
        :isDisabled="bonusChecking"
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

  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    fieldsSettings,
    defaultLocaleFieldsSettings
  } = globalStore;

  const { getContent } = useProjectMethods();

  const hasBonusCode = ref<boolean>(false);
  const bonusValue = ref<string>('');
  const bonusChecking = ref<boolean>(false);

  const { addBonusCode, deleteBonusCode } = useCoreBonusApi();
  const bonusStore = useBonusStore();
  const { depositBonusCode } = storeToRefs(bonusStore);
  const { sendWalletPromoSubmitEvent, sendWalletPromoOpenEvent } = useWalletAnalytics();

  const sendManualBonus = async ():Promise<boolean> => {
    try {
      const response = await addBonusCode(bonusValue.value, 1);
      if (response.status === 2) return true;
      return false;
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
      sendWalletPromoSubmitEvent();

      const bonusActivated = await sendManualBonus();

      if (!bonusActivated) {
        depositBonusCode.value = await addBonusCode(bonusValue.value, 3);
      }
    }

    bonusChecking.value = false;
  };

  const root = ref();
  const toggleBonusField = async ():Promise<void> => {
    if (!hasBonusCode.value) {
      hasBonusCode.value = true;
      sendWalletPromoOpenEvent();

      await nextTick();
      root.value.scrollIntoView({ behavior: 'smooth' });
    } else if (depositBonusCode.value) {
      hasBonusCode.value = false;
      toggleBonusCode();
    } else {
      hasBonusCode.value = false;
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

  watch(() => depositBonusCode.value, (newValue) => {
    if (!newValue && bonusValue.value) {
      toggleBonusField();
    }
  });

  onMounted(() => {
    if (depositBonusCode.value) {
      bonusValue.value = depositBonusCode.value?.bonusCode || '';
      hasBonusCode.value = true;
    }
  });
</script>

<style src="~/assets/styles/components/bonus/deposit-code.scss" lang="scss" />

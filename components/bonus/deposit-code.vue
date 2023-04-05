<template>
  <div class="deposit-bonus-code">
    <form-input-toggle
      name="bonus-toggle"
      v-model:value="hasBonusCode"
      @change="toggleBonusField"
    >
      {{ getContent(popupsData, defaultLocalePopupsData, 'deposit.togglerLabel') || '' }}
    </form-input-toggle>

    <div v-if="hasBonusCode" class="deposit-bonus-code__code">
      <form-input-text
        v-model:value="bonusValue"
        label=""
        :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, 'bonusCode.placeholder') || ''"
        name="bonus-code"
        autocomplete="off"
        :isDisabled="currentDepositBonusCode"
      />

      <button-base
        type="primary"
        size="md"
        @click="toggleStorage"
        :isDisabled="bonusChecking"
      >
        <atomic-spinner :is-shown="bonusChecking"/>
        {{ currentDepositBonusCode ? getContent(popupsData, defaultLocalePopupsData, 'deposit.cancelBonusButton')
          : getContent(popupsData, defaultLocalePopupsData, 'deposit.addBonusButton') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const {
    popupsData,
    defaultLocalePopupsData,
    fieldsContent,
    defaultLocaleFieldsContent,
  } = useGlobalStore();

  const { getContent } = useProjectMethods();

  const hasBonusCode = ref<boolean>(false);
  const bonusValue = ref<string>('');
  const bonusChecking = ref<boolean>(false);

  const { getBonusCodes, addBonusCode, deleteBonusCode } = useCoreBonusApi();
  const { showBonusNotification } = useBonusStore();

  const currentDepositBonusCode = ref<string|undefined>();
  const getDepositBonus = async ():Promise<void> => {
    try {
      const bonusCodeResponse = await getBonusCodes(3);
      if (bonusCodeResponse.length) {
        currentDepositBonusCode.value = bonusCodeResponse[0].bonusCode;
        bonusValue.value = currentDepositBonusCode.value || '';
        hasBonusCode.value = true;
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const sendManualBonus = async ():Promise<boolean> => {
    try {
      const response = await addBonusCode(bonusValue.value, 1);
      if (response.status === 1) {
        showBonusNotification(response.status);
        bonusValue.value = '';
        return true;
      }
      return false;
    } catch (err: any) {
      return false;
    }
  };

  const sendDepositBonus = async ():Promise<boolean> => {
    try {
      await addBonusCode(bonusValue.value, 3);
      return true;
    } catch (err: any) {
      return false;
    }
  };

  const deleteDepositBonus = async ():Promise<boolean> => {
    try {
      await deleteBonusCode(3);
      return true;
    } catch (err: any) {
      return false;
    }
  };

  const toggleStorage = async ():Promise<void> => {
    if (bonusChecking.value) return;
    bonusChecking.value = true;

    if (currentDepositBonusCode.value) {
      const deleteBonus = await deleteDepositBonus();
      if (deleteBonus) {
        currentDepositBonusCode.value = undefined;
        bonusValue.value = '';
      }
    } else if (bonusValue.value) {
      const bonusActivated = await sendManualBonus();

      if (!bonusActivated) {
        const sendDepositCode = await sendDepositBonus();
        if (sendDepositCode) currentDepositBonusCode.value = bonusValue.value;
      }
    }

    bonusChecking.value = false;
  };

  const toggleBonusField = ():void => {
    if (!hasBonusCode.value) hasBonusCode.value = true;
    else if (currentDepositBonusCode.value) {
      hasBonusCode.value = false;
      toggleStorage();
    } else {
      hasBonusCode.value = false;
      bonusValue.value = '';
    }
  };

  onMounted(async () => {
    await getDepositBonus();
  });
</script>

<style lang="scss">
.deposit-bonus-code {
  display: grid;
  grid-gap: rem(16px);

  .input-toggle {
    width: 100%;
    --slider-bg: var(--black-primary);
  }

  &__code {
    display: flex;
    align-items: flex-start;
    grid-column-gap: rem(8px);

    .btn-primary {
      min-width: 96px;
      width: fit-content;
    }
  }
}
</style>

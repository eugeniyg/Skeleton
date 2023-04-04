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
        :isDisabled="storeBonusCode"
      />

      <button-base
        type="primary"
        size="md"
        @click="toggleStorage"
        :isDisabled="bonusChecking"
      >
        <atomic-spinner :is-shown="bonusChecking"/>
        {{ storeBonusCode ? getContent(popupsData, defaultLocalePopupsData, 'deposit.cancelBonusButton')
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

  const { addBonusCode } = useCoreBonusApi();
  const { showBonusNotification } = useBonusStore();
  const sendBonus = async ():Promise<boolean> => {
    if (bonusChecking.value) return false;
    bonusChecking.value = true;

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
    } finally {
      bonusChecking.value = false;
    }
  };

  const storeBonusCode = ref<string|null>(null);
  const toggleStorage = async ():Promise<void> => {
    if (storeBonusCode.value) {
      localStorage.removeItem('depositBonusCode');
      storeBonusCode.value = null;
      bonusValue.value = '';
    } else if (bonusValue.value) {
      const bonusActivated = await sendBonus();
      if (!bonusActivated) {
        localStorage.setItem('depositBonusCode', bonusValue.value);
        storeBonusCode.value = bonusValue.value;
      }
    }
  };

  const toggleBonusField = ():void => {
    if (!hasBonusCode.value) hasBonusCode.value = true;
    else {
      hasBonusCode.value = false;
      localStorage.removeItem('depositBonusCode');
      storeBonusCode.value = null;
      bonusValue.value = '';
    }
  };

  onMounted(() => {
    storeBonusCode.value = localStorage.getItem('depositBonusCode');
    bonusValue.value = storeBonusCode.value || '';

    if (storeBonusCode.value) toggleBonusField();
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

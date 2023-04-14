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
        :isDisabled="!!depositBonusCode"
      />

      <button-base
        type="primary"
        size="md"
        @click="toggleBonusCode"
        :isDisabled="bonusChecking"
      >
        <atomic-spinner :is-shown="bonusChecking"/>
        {{ depositBonusCode ? getContent(popupsData, defaultLocalePopupsData, 'deposit.cancelBonusButton')
          : getContent(popupsData, defaultLocalePopupsData, 'deposit.addBonusButton') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

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

  const { addBonusCode, deleteBonusCode } = useCoreBonusApi();
  const bonusStore = useBonusStore();
  const { depositBonusCode } = storeToRefs(bonusStore);
  const { showBonusNotification } = bonusStore;

  const sendManualBonus = async ():Promise<boolean> => {
    try {
      const response = await addBonusCode(bonusValue.value, 1);
      if (response.status === 2) {
        showBonusNotification(response.status);
        bonusValue.value = '';
        return true;
      }
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
      depositBonusCode.value = undefined;
      bonusValue.value = '';
    } else if (bonusValue.value) {
      const bonusActivated = await sendManualBonus();

      if (!bonusActivated) {
        depositBonusCode.value = await addBonusCode(bonusValue.value, 3);
      }
    }

    bonusChecking.value = false;
  };

  const toggleBonusField = ():void => {
    if (!hasBonusCode.value) hasBonusCode.value = true;
    else if (depositBonusCode.value) {
      hasBonusCode.value = false;
      toggleBonusCode();
    } else {
      hasBonusCode.value = false;
      bonusValue.value = '';
    }
  };

  onMounted(() => {
    if (depositBonusCode.value) {
      bonusValue.value = depositBonusCode.value?.bonusCode || '';
      hasBonusCode.value = true;
    }
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

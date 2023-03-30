<template>
  <div class="bonus-code-block">
    <h4 class="bonus-code-block__title">Have a promocode?</h4>

    <atomic-bonus-code-timer
      v-if="bonusBlocked"
      :timerValue="timerValue"
      @timeOut="openBonus"
    />

    <div class="bonus-code-block__form">
      <form-input-text
        v-model:value="bonusValue"
        label=""
        :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, 'bonusCode.placeholder') || ''"
        name="bonus-code"
        autocomplete="off"
        :isDisabled="bonusBlocked"
      />
      <button-base
        type="primary"
        size="md"
        @click="sendBonus"
        :isDisabled="!bonusValue || bonusBlocked"
      >
        Add
      </button-base>
    </div>

    <div v-if="showErrorMessage" class="bonus-code-block__error">
      The bonus code is incorrect. Try again after 3 minutes
    </div>
  </div>
</template>

<script setup lang="ts">
  const bonusValue = ref<string>('');
  const defaultTimerSeconds = 180;
  const timerValue = ref<number>(defaultTimerSeconds);
  const bonusBlocked = ref<boolean>(false);
  const showErrorMessage = ref<boolean>(false);

  const { fieldsContent, defaultLocaleFieldsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const checkStorageTimer = ():void => {
    const storageValue = localStorage.getItem('bonusTimer');
    if (!storageValue) return;

    const blockTime = Date.parse(storageValue || '');
    const currentTime = Date.now();
    const diffSeconds = Math.ceil(defaultTimerSeconds - (currentTime - blockTime) / 1000);
    if (diffSeconds < 1) {
      localStorage.removeItem('bonusTimer');
      return;
    }

    timerValue.value = diffSeconds;
    bonusBlocked.value = true;
  };

  const blockBonus = ():void => {
    localStorage.setItem('bonusTimer', new Date().toISOString());
    timerValue.value = defaultTimerSeconds;
    bonusBlocked.value = true;
    showErrorMessage.value = true;
  };

  const openBonus = ():void => {
    localStorage.removeItem('bonusTimer');
    bonusBlocked.value = false;
  };

  const { addBonusCode } = useCoreBonusApi();
  const { showBonusNotification } = useBonusStore();
  const sendBonus = async ():Promise<void> => {
    if (!bonusValue.value || bonusBlocked.value) return;

    try {
      const response = await addBonusCode(bonusValue.value, 1);
      showBonusNotification(response.status);
    } catch (err: any) {
      if (err.response?.status === 400 && err.data?.error?.code === 5) {
        blockBonus();
      } else showBonusNotification();
    } finally {
      bonusValue.value = '';
    }
  };

  onMounted(() => {
    checkStorageTimer();
  });
</script>

<style lang="scss">
.bonus-code-block {
  width: calc((100% - 32px) / 3);
  padding: rem(24px) rem(18px);
  background-color: var(--gray-900);
  border-radius: 16px;
  user-select: none;

  &__title {
    @include font($heading-4);
    color: var(--white);
    margin: 0 0 rem(24px);
    text-align: center;
  }

  &__form {
    display: flex;
    align-items: flex-start;
    grid-column-gap: rem(8px);

    .btn-primary {
      width: fit-content;
    }
  }

  &__error {
    margin-top: 8px;
    color: var(--red-300);

    @include font($body-0);
  }
}
</style>

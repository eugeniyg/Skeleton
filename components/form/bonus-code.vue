<template>
  <div class="form-bonus-code">
    <form-input-text
      v-model:value="bonusValue"
      label=""
      :placeholder="fieldsContent?.bonusCode?.placeholder || ''"
      name="bonus-code"
      autocomplete="off"
    />
    <button-base
      type="primary"
      size="md"
      @click="emulateAddBonus"
      :is-disabled="!bonusValue.length"
    >
      Add
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const { fieldsContent } = useGlobalStore();
  const { showAlert } = useLayoutStore();

  const bonusValue = ref<string>('');

  const bonusCodeStatuses = {
    gotBonus: {
      title: 'You got the bonus',
      type: 'done',
    },
    haveToDeposit: {
      title: 'You have to deposit to receive the bonus',
      type: 'warning',
    },
    bonusAvailable: {
      title: 'Sorry, but the bonus with the entered bonus code is not available for you.\n',
      type: 'warning',
    },
    incorrectBonusCode: {
      title: 'Sorry, but you entered the incorrect bonus code.',
      type: 'error',
    },
  };

  const emulateAddBonus = () => {
    const alertProps = bonusCodeStatuses.bonusAvailable;
    showAlert(alertProps);
  };
</script>

<style lang="scss">
.form-bonus-code {
  display: flex;
  align-items: flex-start;
  grid-column-gap: rem(8px);

  .btn-primary {
    width: fit-content;
  }
}
</style>

<template>
  <div class="input-card">
    <form-input-number
      placeholder="0000 0000 0000 0000"
      name="name3"
      label="Card number"
      :value="0"
      :max="9999999999999999"
      :mask="isProcessSimulate ? cardNumberMaskCheck : cardNumberMaskDefault"
      :hint="isProcessSimulate ? { variant: 'error', message: 'The card number entered is Invalid' } : null"
    />

    <form-input-text name="name4" label="Name of card" placeholder="Enter name" />

    <div class="row">
      <form-input-text name="name5" label="Expire Date" placeholder="MM / YY" />
      <form-input-number
        name="name6"
        placeholder="CVV"
        label="Security Code"
        :value="0"
        :max="9999"
        :mask="securityCodeMask"
        :hint="isProcessSimulate ? { variant: 'error', message: 'Please enter a 3 digit security code' } : null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const isProcessSimulate = ref<boolean>(false);
  const cardNumberMaskDefault = { type: 'icon', value: 'credit-card' };
  const cardNumberMaskCheck = { type: 'img', value: '/svg/colored/visa.svg' };
  const securityCodeMask = { type: 'icon', value: 'info' };

  onMounted(() => {
    isProcessSimulate.value = true;
  });
</script>

<style src="~/assets/styles/components/form/input/card.scss" lang="scss" />

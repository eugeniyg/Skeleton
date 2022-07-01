<template>
  <form class="form-deposit-crypto">
    <atomic-qr/>
    <form-input-copy
      name="name7"
      label="Send any amount of BTC (plus miner fee) to"
      :hint="{message: 'Min: 0.0001 BTC'}"
      value="3DPAYfeYGRgPg6xDehQQFC7hqm49eo1..."
    />
    <atomic-divider/>
    <atomic-bonus/>
    <atomic-divider/>
    <div class="row">
      <form-input-toggle name="bonus-code" :is-checked="hasBonusCode" @input="hasBonusCode = $event">I have bonus code</form-input-toggle>
      <form-input-text v-if="hasBonusCode" placeholder="Enter bonus code" name="bonus-code"/>
    </div>
    <button-base type="primary" size="md">Deposit 50 EUR</button-base>
  </form>
</template>

<script setup lang="ts">
  const hasBonusCode = ref<boolean>(false);
</script>

<style lang="scss" src="./style.scss"></style>

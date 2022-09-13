<template>
<form class="form-deposit-crypto">
  <atomic-qr/>
  <form-input-copy
    name="name7"
    label="Send any amount of BTC (plus miner fee) to"
    :hint="{message: 'Min: 0.0001 BTC'}"
    value="3DPAYfeYGRgPg6xDehQQFC7hqm49eo1..."
  />

  <template v-if="depositContent?.bonuses?.length">
    <atomic-divider/>
    <template v-for="(bonus, index) in depositContent?.bonuses" :key="index">
      <atomic-bonus v-bind="bonus"/>
      <atomic-divider/>
    </template>
  </template>

  <div class="row">
    <form-input-toggle
      name="bonus-toggle"
      v-model:value="hasBonusCode"
      @change="hasBonusCode = !hasBonusCode"
    >
      {{ depositContent?.togglerLabel || '' }}
    </form-input-toggle>

    <form-input-text
      v-if="hasBonusCode"
      v-model:value="bonusValue"
      label=""
      :placeholder="fieldsContent?.bonusCode?.placeholder || ''"
      name="bonus-code"
    />
  </div>
</form>
</template>

<script setup lang="ts">
import {DepositInterface} from '~/types';

const hasBonusCode = ref<boolean>(false);
 const bonusValue = ref<string>('');
const {popupsData, fieldsContent, alertsData} = useGlobalStore();

const depositContent: DepositInterface | undefined = popupsData?.deposit;
</script>

<style lang="scss" src="./style.scss"/>

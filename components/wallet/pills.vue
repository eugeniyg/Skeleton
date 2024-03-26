<template>
  <div class="wallet-pills">
    <div
      v-for="item in filteredItems"
      :key="item.amount"
      class="wallet-pills__item"
      :class="{ 'is-selected': String(item.amount) === props.value }"
      @click="selectItem(String(item.amount))"
    >
      {{ item.amount }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPaymentPreset } from "@skeleton/core/types";

  const props = defineProps<{
    value: string;
    items: IPaymentPreset[];
    amountMax: number;
    amountMin: number;
  }>();

  const filteredItems = props.items.filter(item => {
    return item.amount >= props.amountMin && item.amount <= props.amountMax;
  });
  const emit = defineEmits(['update:value']);

  const selectItem = (amount: string):void => {
    if (amount === props.value) return;
    emit('update:value', amount);
  };
</script>

<style src="~/assets/styles/components/wallet/pills.scss" lang="scss"/>
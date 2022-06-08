<template>
  <div class="card-wallet" :class="{'is-active': active}">
    <div class="content">
      <div class="title">{{ title }}</div>

      <form-input-toggle name="toggle" :is-checked="active" @change="select">
        Use currency
      </form-input-toggle>

      <div class="amount">
        <span class="amount">{{ balance.amount }}</span>
        <span class="currency">{{ balance.currency }}</span>
      </div>

      <button-base class="hide-currency" type="ghost" size="xs">Hide currency</button-base>

      <template v-if="active">
        <div class="actions">
          <button-base type="primary" size="md">Deposit</button-base>
          <button-base type="secondary" size="md">Withdraw</button-base>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: 'Bitcoin (BTC)',
    },
    balance: {
      type: Object,
      default: () => ({
        currency: 'uBTC',
        amount: '0.00000000',
      }),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  });

  const active = ref<boolean>(props.isActive);
  const select = ():void => {
    active.value = !active.value;
  };
</script>

<style lang="scss" src="./style.scss"/>

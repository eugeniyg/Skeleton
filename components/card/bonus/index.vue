<template>
  <div class="card-bonus" :class="{'is-active': active}">
    <div class="content">
      <div class="title">{{ props.title }}</div>
      <form-input-toggle name="toggle" :is-checked="active" @change="select">Use currency</form-input-toggle>

      <div class="amount">
        <span class="amount">{{ props.balance.amount }}</span>
        <span class="currency">{{ props.balance.currency }}</span>
      </div>

      <button-base class="hide-currency" type="ghost" size="xs">Hide currency</button-base>

      <div v-if="active" class="actions">
        <button-base type="primary" size="md">Deposit</button-base>
        <button-base type="secondary" size="md">Withdraw</button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    balance: {
      type: Object,
      required: true,
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

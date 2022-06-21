<template>
  <div class="balance">
    <div class="row">
      <div class="label">Balance</div>
      <div class="value">
        {{ activeAccount.formatBalance.amount }} {{ activeAccount.formatBalance.currency }}
      </div>
    </div>

    <div class="row" v-if="props.withdraw">
      <div class="label">Withdraw</div>
      <div class="value">
        {{ activeAccount.formatBalance.amount }} {{ activeAccount.formatBalance.currency }}
      </div>
    </div>
    <atomic-divider />
    <slot/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    withdraw: {
      type: Boolean,
      default: false,
    },
  });
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
</script>

<style lang="scss" src="./style.scss"/>

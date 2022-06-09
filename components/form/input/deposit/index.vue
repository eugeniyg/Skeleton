<template>
  <div class="input-deposit">
    <div class="amount">{{ activeAccount.formatBalance.amount }}</div>
    <div class="label">{{ activeAccount.formatBalance.currency }}</div>
    <button-deposit/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
</script>

<style lang="scss" src="./style.scss"/>

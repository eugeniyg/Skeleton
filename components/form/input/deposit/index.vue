<template>
  <div class="input-deposit">
    <div class="amount">{{ balanceFormat.amount }}</div>
    <div class="label">{{ balanceFormat.currency }}</div>
    <button-deposit/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const walletStore = useWalletStore();
  const { formatBalance } = useProjectMethods();
  const { activeAccount } = storeToRefs(walletStore);

  const balanceFormat = computed(() => formatBalance(activeAccount.value.currency, activeAccount.value.balance));
</script>

<style lang="scss" src="./style.scss"/>

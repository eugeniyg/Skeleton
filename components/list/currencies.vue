<template>
  <div class="list-currencies">
    <button-base type="secondary">All currencies</button-base>
    <button-base type="secondary">Crypto</button-base>
    <div class="items">
      <div class="item"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const walletStore = useWalletStore();
  const { accounts } = storeToRefs(walletStore);
  console.log(accounts.value);
</script>

<style lang="scss">
  .list-currencies {}
</style>

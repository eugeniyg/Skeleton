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

  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));
</script>

<style lang="scss">
.input-deposit {
  @include radius(12px);
  @include font($heading-2);
  @extend %flex-items-center;
  background-color: var(--gray-900);
  color: var(--gray-500);

  .amount {
    @extend %flex-items-center;
    padding-left: rem(16px);

    span:first-child {
      color: var(--white);
    }
  }

  .label {
    @extend %flex-items-center;
    margin: 0 rem(8px) 0 rem(4px);
  }
}
</style>

<template>
  <div class="input-deposit">
    <div class="select">
      <div class="amount">{{ balanceFormat.amount }}</div>
      <div class="label">{{ balanceFormat.currency }}</div>
      <atomic-icon v-if="true" class="icon-expand" id="arrow_expand-close"/>
      <list-currencies/>
    </div>
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
  display: flex;
  background-color: var(--gray-900);
  color: var(--gray-500);

  .amount {
    @extend %flex-items-center;

    span:first-child {
      color: var(--white);
    }
  }

  .label {
    @extend %flex-items-center;
    margin: 0 rem(8px) 0 rem(4px);
  }

  .select {
    display: flex;
    position: relative;
    padding: 0 16px;
    flex-shrink: 1;
    align-items: center;
  }

  .icon-expand {
    --color: var(--white);
    --icon-size: 20px;
  }
}
</style>

<template>
  <div class="input-deposit">
    <div
      class="select"
      :class="{'is-open': isShow}"
      @click="toggleSelect"
      v-click-outside="closeDropdown"
    >
      <div class="amount">{{ balanceFormat.amount }}</div>
      <div class="label">{{ balanceFormat.currency }}</div>
      <atomic-icon class="icon-expand" id="arrow_expand-close"/>
      <list-currencies :is-open="isShow" @hide-currencies-list="isShow = false" @click.stop />
    </div>
    <button-deposit/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const walletStore = useWalletStore();
  const { formatBalance } = useProjectMethods();
  const { activeAccount } = storeToRefs(walletStore);

  const isShow = ref<boolean>(false);

  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));

  const toggleSelect = () => {
    isShow.value = !isShow.value;
  };

  const closeDropdown = () => {
    if (isShow.value) isShow.value = false;
  };
</script>

<style lang="scss">
.input-deposit {
  @include radius(12px);
  @include font($heading-2);
  display: flex;
  background-color: var(--gray-900);
  color: var(--gray-500);
  user-select: none;

  .amount {
    @extend %flex-items-center;
    color: var(--white);
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

    @include use-hover {
      &:hover {
        cursor: pointer;
      }
    }

    &.is-open {
      .icon-expand {
        --icon-transform: rotate(-180deg);
        --color: var(--white);
      }
    }
  }

  .icon-expand {
    transform: var(--icon-transform, rotate(0));
    transition: transform 0.2s ease-in-out;
    --color: var(--gray-400);
    --icon-size: 20px;
  }
}
</style>

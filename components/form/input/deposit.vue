<template>
  <client-only>
    <div class="input-deposit">
      <div v-click-outside="closeDropdown" class="select" :class="{ 'is-open': isShow }" @click="toggleSelect">
        <atomic-fiat-display v-if="showEquivalentBalance" />
        <div v-else class="select__content">
          <div class="amount">{{ balanceFormat.amount }}</div>
          <div class="label">{{ balanceFormat.currency }}</div>
        </div>

        <atomic-icon id="arrow-expand-close" class="icon-expand" />

        <list-balance :is-open="isShow" @close="isShow = false" @click.stop />
      </div>

      <button-deposit />
    </div>
  </client-only>
</template>

<script setup lang="ts">
  import { formatBalance } from '@skeleton/helpers/amountMethods';

  const walletStore = useWalletStore();
  const { getPlayerBonuses } = useBonusStore();
  const { activeAccount, showEquivalentBalance } = storeToRefs(walletStore);

  const isShow = ref<boolean>(false);

  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));

  const toggleSelect = () => {
    if (!isShow.value) {
      useEvent('analyticsEvent', { event: 'openBalancePopup' });
      getPlayerBonuses();
    }

    isShow.value = !isShow.value;
  };

  const closeDropdown = () => {
    if (isShow.value) isShow.value = false;
  };
</script>

<style src="~/assets/styles/components/form/input/deposit.scss" lang="scss" />

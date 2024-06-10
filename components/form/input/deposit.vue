<template>
  <client-only>
    <div class="input-deposit">
      <div
        class="select"
        :class="{'is-open': isShow}"
        @click="toggleSelect"
        v-click-outside="closeDropdown"
      >
        <atomic-fiat-display v-if="showEquivalentBalance" />
        <div class="select__content" v-else>
          <div class="amount">{{ balanceFormat.amount }}</div>
          <div class="label">{{ balanceFormat.currency }}</div>
        </div>

        <atomic-icon class="icon-expand" id="arrow_expand-close"/>

        <list-balance
          :is-open="isShow"
          @close="isShow = false"
          @click.stop
        />
      </div>

      <button-deposit />
    </div>
  </client-only>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { formatBalance } = useProjectMethods();
  const { getPlayerBonuses } = useBonusStore();
  const { activeAccount, showEquivalentBalance } = storeToRefs(walletStore);

  const isShow = ref<boolean>(false);

  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));

  const toggleSelect = () => {
    if (!isShow.value) {
      useAnalyticsEvent('balance', { event: 'openBalancePopup' });
      getPlayerBonuses();
    }

    isShow.value = !isShow.value;
  };

  const closeDropdown = () => {
    if (isShow.value) isShow.value = false;
  };
</script>

<style src="~/assets/styles/components/form/input/deposit.scss" lang="scss" />


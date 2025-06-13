<template>
  <div class="wallet-methods">
    <div class="wallet-methods__header">
      <wallet-tabs v-if="props.showTabs" :selected="props.selectedTab" @change-tab="emit('changeTab', $event)" />

      <div v-else class="wallet-methods__header-title">
        {{ props.modalTitle }}
      </div>
    </div>

    <wallet-region />

    <balance :withdraw="props.selectedTab === 'withdraw'" @changingAccount="emit('changingAccount', $event)">
      <div v-if="props.loading" class="input-payments">
        <div class="items">
          <Skeletor v-for="item in 2" :key="item" class="item" as="div" />
        </div>
      </div>

      <form-input-payments
        v-else-if="props.selectedTab === 'deposit'"
        v-model:active-method="currentDepositMethod"
        :items="depositMethods"
        @update:active-method="handleMethodChanged('deposit')"
        @method-click="emit('methodClick')"
      />

      <form-input-payments
        v-else-if="props.selectedTab === 'withdraw'"
        v-model:active-method="currentWithdrawMethod"
        :items="withdrawMethods"
        @update:active-method="handleMethodChanged('withdraw')"
        @method-click="emit('methodClick')"
      />

      <template v-if="showNotAvailableText">
        <wallet-missing-methods-msg :display="!props.loading" />
        <wallet-missing-methods :display="!props.loading" :selected-tab="props.selectedTab" />
      </template>
    </balance>

    <wallet-dots :items-count="2" :active-index="0" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IPaymentMethod } from '@skeleton/core/types';
  import { Skeletor } from 'vue-skeletor';

  const props = defineProps<{
    showTabs: boolean;
    selectedTab: 'deposit' | 'withdraw';
    modalTitle: string;
    loading: boolean;
  }>();

  const currentDepositMethod = defineModel<IPaymentMethod>('currentDepositMethod');
  const currentWithdrawMethod = defineModel<IPaymentMethod>('currentWithdrawMethod');
  const emit = defineEmits(['changeTab', 'methodClick', 'changingAccount']);
  const walletStore = useWalletStore();
  const { depositMethods, withdrawMethods } = storeToRefs(walletStore);

  const showNotAvailableText = computed(() => {
    return (
      (!depositMethods.value?.length && props.selectedTab === 'deposit') ||
      (!withdrawMethods.value?.length && props.selectedTab === 'withdraw')
    );
  });

  const handleMethodChanged = (walletOperationType: 'deposit' | 'withdraw'): void => {
    useEvent('analyticsEvent', {
      event: 'walletChangeMethod',
      walletOperationType,
    });
  };
</script>

<style src="~/assets/styles/components/wallet/methods.scss" lang="scss" />

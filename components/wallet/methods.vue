<template>
  <div class="wallet-methods">
    <div class="wallet-methods__header">
      <wallet-tabs v-if="props.showTabs" :selected="props.selectedTab" @change-tab="emit('changeTab', $event)" />

      <div v-else class="wallet-methods__header-title">
        {{ props.modalTitle }}
      </div>
    </div>

    <wallet-region />

    <balance :withdraw="props.selectedTab === 'withdraw'">
      <form-input-payments
        v-if="props.selectedTab === 'deposit'"
        v-model:active-method="currentDepositMethod"
        :items="depositMethods"
        @update:active-method="handleMethodChanged('deposit')"
        @method-click="emit('methodClick')"
      />

      <form-input-payments
        v-if="props.selectedTab === 'withdraw'"
        v-model:active-method="currentWithdrawMethod"
        :items="withdrawMethods"
        @update:active-method="handleMethodChanged('withdraw')"
        @method-click="emit('methodClick')"
      />

      <div v-if="showNotAvailableText" class="wallet-modal__empty-methods">
        <atomic-icon id="info" />

        <span>
          {{ getContent(walletContent, defaultLocaleWalletContent, 'notAvailableText') }}
        </span>
      </div>
    </balance>

    <wallet-dots :items-count="2" :active-index="0" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IPaymentMethod } from '@skeleton/core/types';
  import type { IWalletModal } from '~/types';

  const props = defineProps<{
    showTabs: boolean;
    selectedTab: string;
    modalTitle: string;
  }>();

  const currentDepositMethod = defineModel<IPaymentMethod>('currentDepositMethod');
  const currentWithdrawMethod = defineModel<IPaymentMethod>('currentWithdrawMethod');
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');

  const emit = defineEmits(['changeTab', 'methodClick']);
  const { getContent } = useProjectMethods();
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

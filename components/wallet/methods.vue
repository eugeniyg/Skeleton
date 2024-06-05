<template>
  <div class="wallet-methods">
    <div class="wallet-methods__header">

      <wallet-tabs
        v-if="props.showTabs"
        :selected="props.selectedTab"
        @changeTab="emit('changeTab', $event)"
      />

      <div v-else class="wallet-methods__header-title">
        {{ props.modalTitle }}
      </div>
    </div>

    <!--        <wallet-region v-bind="chooseRegionProps">-->
    <!--          <div class="identity">-->
    <!--            ID {{ playerIdentity }}-->
    <!--          </div>-->
    <!--        </wallet-region>-->

    <balance :withdraw="props.selectedTab === 'withdraw'">
      <form-input-payments
        v-if="props.selectedTab === 'deposit'"
        :items="depositMethods"
        v-model:activeMethod="currentDepositMethod"
        @update:activeMethod="sendWalletMethodEvent('deposit')"
      />

      <form-input-payments
        v-if="props.selectedTab === 'withdraw'"
        :items="withdrawMethods"
        v-model:activeMethod="currentWithdrawMethod"
        @update:activeMethod="sendWalletMethodEvent('withdraw')"
      />

      <div
        v-if="showNotAvailableText"
        class="wallet-modal__empty-methods"
      >
        <atomic-icon id="info" />

        <span>
          {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.notAvailableText') }}
        </span>
      </div>
    </balance>

    <wallet-dots
      :itemsCount="2"
      :activeIndex="0"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";

  const props = defineProps<{
    showTabs: boolean;
    selectedTab: string;
    modalTitle: string;
  }>()

  const currentDepositMethod = defineModel('currentDepositMethod');
  const currentWithdrawMethod = defineModel('currentWithdrawMethod');
  const { sendWalletMethodEvent } = useWalletAnalytics();

  const emit = defineEmits(['changeTab']);
  const { getContent } = useProjectMethods();
  const walletStore = useWalletStore();
  const {
    depositMethods,
    withdrawMethods
  } = storeToRefs(walletStore);

  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);

  const showNotAvailableText = computed(() => {
    return (!depositMethods.value?.length && props.selectedTab === 'deposit')
      || (!withdrawMethods.value?.length && props.selectedTab === 'withdraw');
  })
</script>

<style src="~/assets/styles/components/wallet/methods.scss" lang="scss"/>
<template>
  <vue-final-modal
    v-model="modals.wallet"
    class="wallet-modal"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @closed="closedHandler"
  >
    <div class="wallet-modal__container" :class="{ 'show-form': showMobileForm }">
      <button-modal-close @close="handleClose" :class="{ 'close-secondary': hasOffset }" />

      <wallet-methods
        v-model:currentDepositMethod="currentDepositMethod"
        v-model:currentWithdrawMethod="currentWithdrawMethod"
        :showTabs="showTabs"
        :selectedTab="selectedTab"
        :modalTitle="modalTitle"
        @changeTab="changeTab"
        @methodClick="showMobileForm = true"
      />

      <wallet-forms
        :showMobileForm="showMobileForm"
        :currentDepositMethod="currentDepositMethod"
        :currentWithdrawMethod="currentWithdrawMethod"
        :showTabs="showTabs"
        :selectedTab="selectedTab"
        :modalTitle="modalTitle"
        @changeTab="changeTab"
      />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IPaymentMethod } from '@skeleton/core/types';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { getContent } = useProjectMethods();
  const hasOffset = ref<boolean>(false);

  const { modals, walletModalType } = storeToRefs(layoutStore);
  const { showModal, closeModal } = layoutStore;

  const {
    depositMethods,
    withdrawMethods
  } = storeToRefs(walletStore);

  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);

  const currentDepositMethod = ref<IPaymentMethod|undefined>();
  const currentWithdrawMethod = ref<IPaymentMethod|undefined>();
  const selectedTab = ref<'deposit'|'withdraw'>(walletModalType?.value || 'deposit');
  const showMobileForm = ref<boolean>(false);
  const { sendWalletChangeTypeEvent, sendWalletCloseEvent } = useWalletAnalytics();

  const changeTab = (tabId: 'deposit'|'withdraw'): void => {
    if (tabId === 'withdraw') {
      walletModalType.value = tabId;
      if (mobileWidth()) currentWithdrawMethod.value = undefined;
    } else {
      walletModalType.value = undefined;
      if (mobileWidth()) currentDepositMethod.value = undefined;
    }

    sendWalletChangeTypeEvent(tabId);
  };

  const showTabs = computed(() => {
    return walletModalType?.value !== 'deposit';
  });

  const modalTitle = computed(() => {
    return selectedTab.value === 'deposit'
      ? getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.deposit.title')
      : getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.withdraw.title')
  })

  const mobileWidth = ():boolean => {
    return window.innerWidth < 768;
  }

  watch(() => depositMethods.value, () => {
    if (mobileWidth()) {
      currentDepositMethod.value = undefined;
    } else {
      currentDepositMethod.value = depositMethods.value[0];
    }
  });

  watch(() => withdrawMethods.value, () => {
    if (mobileWidth()) {
      currentWithdrawMethod.value = undefined;
    } else {
      currentWithdrawMethod.value = withdrawMethods.value[0];
    }
  });

  watch(() => walletModalType?.value, () => {
    selectedTab.value = walletModalType?.value || 'deposit';
  })

  const closeWallet = (): void => {
    if (walletModalType?.value === 'deposit') {
      showModal('cancelDeposit');
    } else {
      closeModal('wallet');
    }
  }

  const handleClose = ():void => {
    if (mobileWidth() && showMobileForm.value) showMobileForm.value = false;
    else closeWallet();
  }

  const closedHandler = (): void => {
    sendWalletCloseEvent(selectedTab.value);
  }
</script>

<style src="~/assets/styles/components/modal/wallet.scss" lang="scss"/>
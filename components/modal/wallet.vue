<template>
  <vue-final-modal
    class="wallet-modal"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @closed="closedHandler"
  >
    <div class="wallet-modal__container" :class="{ 'show-form': showMobileForm }">
      <button-modal-close :class="{ 'close-secondary': hasOffset }" @close="handleClose" />

      <wallet-methods
        v-model:current-deposit-method="currentDepositMethod"
        v-model:current-withdraw-method="currentWithdrawMethod"
        :show-tabs="showTabs"
        :selected-tab="selectedTab"
        :modal-title="modalTitle"
        :loading="status === 'pending' || changingAccount"
        @change-tab="changeTab"
        @method-click="showMobileForm = true"
        @changingAccount="changingAccount = $event"
      />

      <wallet-forms
        :show-mobile-form="showMobileForm"
        :current-deposit-method="currentDepositMethod"
        :current-withdraw-method="currentWithdrawMethod"
        :show-tabs="showTabs"
        :selected-tab="selectedTab"
        :modal-title="modalTitle"
        :loading="status === 'pending' || changingAccount"
        @change-tab="changeTab"
      />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import type { IPaymentMethod } from '@skeleton/api/types';
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['wallet']>;
    defaultLocaleData: Maybe<IModalsContent['wallet']>;
  }>();

  provide('walletContent', props.currentLocaleData);
  provide('defaultLocaleWalletContent', props.defaultLocaleData);

  const walletStore = useWalletStore();
  const hasOffset = ref<boolean>(false);
  const bonusStore = useBonusStore();
  const { walletDepositBonus } = storeToRefs(bonusStore);
  const modalStore = useModalStore();
  const { currentLocaleModalsContent, defaultLocaleModalsContent } = useGlobalStore();
  const { openModal, closeModal } = modalStore;
  const { walletModalType } = storeToRefs(modalStore);
  const { depositMethods, withdrawMethods } = storeToRefs(walletStore);
  const mobileWidth = (): boolean => {
    return window.innerWidth < 768;
  };
  const currentDepositMethod = ref<IPaymentMethod | undefined>(mobileWidth() ? undefined : depositMethods.value[0]);
  const currentWithdrawMethod = ref<IPaymentMethod | undefined>(mobileWidth() ? undefined : withdrawMethods.value[0]);
  const selectedTab = ref<'deposit' | 'withdraw'>(walletModalType?.value || 'deposit');
  const showMobileForm = ref<boolean>(false);
  const displayCancelDepositModal =
    defaultLocaleModalsContent?.cancelDeposit?.displayModal ??
    currentLocaleModalsContent?.cancelDeposit?.displayModal ??
    true;

  const changeTab = (tabId: 'deposit' | 'withdraw'): void => {
    if (tabId === 'withdraw') {
      walletModalType.value = tabId;
      if (mobileWidth()) currentWithdrawMethod.value = undefined;
    } else {
      walletModalType.value = undefined;
      if (mobileWidth()) currentDepositMethod.value = undefined;
    }

    useEvent('analyticsEvent', {
      event: 'walletChangeType',
      walletOperationType: tabId,
    });
  };

  const showTabs = computed(() => {
    return walletModalType?.value !== 'deposit';
  });

  const modalTitle = computed(() => {
    return selectedTab.value === 'deposit'
      ? getContent(props.currentLocaleData, props.defaultLocaleData, 'deposit.title')
      : getContent(props.currentLocaleData, props.defaultLocaleData, 'withdraw.title');
  });

  watch(depositMethods, () => {
    if (mobileWidth()) {
      currentDepositMethod.value = undefined;
    } else {
      currentDepositMethod.value = depositMethods.value[0];
    }
  });

  watch(withdrawMethods, () => {
    if (mobileWidth()) {
      currentWithdrawMethod.value = undefined;
    } else {
      currentWithdrawMethod.value = withdrawMethods.value[0];
    }
  });

  watch(
    () => walletModalType?.value,
    () => {
      selectedTab.value = walletModalType?.value || 'deposit';
    }
  );

  const closeWallet = (): void => {
    if (walletModalType?.value === 'deposit' && displayCancelDepositModal) {
      openModal('cancel-deposit');
    } else {
      closeModal('wallet');
    }
  };

  const handleClose = (): void => {
    if (mobileWidth() && showMobileForm.value) showMobileForm.value = false;
    else closeWallet();
  };

  const closedHandler = (): void => {
    if (walletDepositBonus.value) walletDepositBonus.value = undefined;
    useEvent('analyticsEvent', {
      event: 'walletClose',
      walletOperationType: selectedTab.value,
    });
  };

  const { getDepositMethods, getWithdrawMethods } = walletStore;
  const { getTurnOverWager } = useRiskStore();
  const { getDepositBonuses, getDepositBonusCode } = bonusStore;
  const changingAccount = ref(false);
  const { status } = await useLazyAsyncData(() => {
    return Promise.allSettled([
      getDepositMethods(),
      getWithdrawMethods(),
      getDepositBonuses(),
      getDepositBonusCode(),
      getTurnOverWager(),
    ]);
  });
</script>

<style src="~/assets/styles/components/modal/wallet.scss" lang="scss" />

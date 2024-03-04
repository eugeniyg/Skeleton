<template>
  <vue-final-modal
    v-model="modals.wallet"
    class="wallet-modal"
    :clickToClose="false"
  >
    <div class="wallet-modal__container" :class="{ 'show-form': showMobileForm }">
      <div class="wallet-modal__slot-left">
        <div class="wallet-modal__slot-left__header">
          <button-modal-close @close="closeWallet" />

          <wallet-tabs
            v-if="showTabs"
            :items="tabItems"
            :selected="selectedTab"
            @changeTab="changeTab"
          />

          <div v-else class="wallet-modal__slot-left__header-title">
            {{ modalTitle }}
          </div>
        </div>

        <!--        <wallet-region v-bind="chooseRegionProps">-->
        <!--          <div class="identity">-->
        <!--            ID {{ playerIdentity }}-->
        <!--          </div>-->
        <!--        </wallet-region>-->
        
        <balance :withdraw="selectedTab === 'withdraw'">
          <form-input-payments
            v-if="selectedTab === 'deposit'"
            :items="depositMethods"
            v-model:activeMethod="currentDepositMethod"
            @update:activeMethod="showMobileForm = true"
          />
          
          <form-input-payments
            v-if="selectedTab === 'withdraw'"
            :items="withdrawMethods"
            v-model:activeMethod="currentWithdrawMethod"
            @update:activeMethod="showMobileForm = true"
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

      <div class="wallet-modal__slot-right">
        <div
          class="wallet-modal__slot-right__header"
          :class="{ 'wallet-modal__slot-right__header--without-tabs': !showTabs }"
        >
          <wallet-tabs
            v-if="showTabs"
            :items="tabItems"
            :selected="selectedTab"
            @changeTab="changeTab"
          />

          <button-modal-close @close="handleClose" />
          <wallet-header v-bind="walletHeaderProps"/>
          <div class="identity">ID {{ playerIdentity }}</div>
        </div>

        <div class="wallet-modal__slot-right__header-secondary">
          <div class="wallet-modal__slot-right__header-secondary__title">
            {{ modalTitle }}
          </div>

          <div class="identity">ID {{ playerIdentity }}</div>
        </div>

        <div class="wallet-modal__slot-right-content">
          <template v-if="selectedTab === 'deposit'">
            <wallet-limit
              v-if="depositLimitError"
              :currentLocaleLimitsContent="currentLocaleLimitsContent"
              :defaultLocaleLimitsContent="defaultLocaleLimitsContent"
            />

            <template v-else-if="depositMethods?.length && currentDepositMethod">
              <form-deposit
                :key="`${currentDepositMethod.method}-${depositMethodKey}`"
                v-if="currentDepositMethod.type === 'form'"
                v-bind="currentDepositMethod"
              />

              <form-deposit-crypto
                v-if="currentDepositMethod.type === 'address'"
                v-bind="currentDepositMethod"
                :key="`${currentDepositMethod.method}-${depositMethodKey}`"
              />
            </template>

            <div v-else class="wallet-modal__empty-methods">
              <atomic-icon id="info" />

              <span>
              {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.notAvailableText') }}
            </span>
            </div>
          </template>

          <template v-else-if="selectedTab === 'withdraw'">
            <form-withdraw
              v-if="withdrawMethods?.length && currentWithdrawMethod"
              :key="currentWithdrawMethod.method"
              v-bind="currentWithdrawMethod"
            />

            <div v-else class="wallet-modal__empty-methods">
              <atomic-icon id="info" />

              <span>
              {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.notAvailableText') }}
            </span>
            </div>
          </template>
        </div>

        <wallet-dots
          :itemsCount="2"
          :activeIndex="1"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IPaymentMethod } from '@skeleton/core/types';
  import type { IConstants, IProfileLimits } from '~/types';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const walletStore = useWalletStore();
  const profileStore = useProfileStore();
  const globalStore = useGlobalStore();
  const { getContent } = useProjectMethods();

  const { modals, walletModalType } = storeToRefs(layoutStore);
  const { showModal, closeModal } = layoutStore;

  const {
    depositMethods,
    withdrawMethods,
    activeAccount,
    activeAccountType,
    depositLimitError
  } = storeToRefs(walletStore);

  const {
    currentLocale,
    defaultLocale,
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);

  const { profile } = storeToRefs(profileStore);

  const currentDepositMethod = ref<IPaymentMethod|undefined>();
  const currentWithdrawMethod = ref<IPaymentMethod|undefined>();
  const depositMethodKey = ref<number>(0);
  const selectedTab = ref<string>(walletModalType?.value || 'deposit');

  const tabItems = computed(() => {
    const contentTabs = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.tabs') || {};
    return Object.keys(contentTabs).map(key => ({ id: key, label: contentTabs[key] }));
  })

  const changeTab = (tabId: 'deposit'|'withdraw'): void => {
    if (tabId === 'withdraw') {
      walletModalType.value = tabId;
      if (mobileWidth()) currentWithdrawMethod.value = undefined;
    } else {
      walletModalType.value = undefined;
      if (mobileWidth()) currentDepositMethod.value = undefined;
    }
  };

  const showTabs = computed(() => {
    return walletModalType?.value !== 'deposit';
  });

  const modalTitle = computed(() => {
    return selectedTab.value === 'deposit'
      ? getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.deposit.title')
      : getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.withdraw.title')
  })

  const playerIdentity = computed(() => {
    if (!profile.value?.id) return '';
    return profile.value.id.split('-')[0].toUpperCase();
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
    depositMethodKey.value += 1;
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

  const methodLogoUrl = computed(() => {
    if (selectedTab.value === 'deposit' && currentDepositMethod.value?.logo) {
      return currentDepositMethod.value?.logo;
    }

    if (selectedTab.value === 'withdraw' && currentWithdrawMethod.value?.method === '0x.withdrawal.cash_agent') {
      return '/img/methods-icons/cash-agent.svg'
    }

    if (selectedTab.value === 'withdraw' && currentWithdrawMethod.value?.logo) {
      return currentWithdrawMethod.value.logo;
    }

    if (activeAccountType.value === 'fiat') return '/img/methods-icons/cards.svg';

    if (activeAccount.value?.currency) return `/img/methods-icons/${activeAccount.value.currency}.svg`;

    return undefined;
  });

  const walletHeaderProps = computed(() => ({
    src: methodLogoUrl.value,
    defaultImage: activeAccountType.value === 'fiat'
      ? '/img/methods-icons/cards.svg'
      : '/img/methods-icons/crypto-placeholder.svg',
    title: getContent(popupsData.value, defaultLocalePopupsData.value, `wallet.tabs.${selectedTab.value}`),
    subTitle: activeAccount.value?.currency,
  }))

  const closeWallet = (): void => {
    if (walletModalType?.value === 'deposit') {
      showModal('cancelDeposit');
    } else {
      closeModal('wallet');
    }
  }

  const showMobileForm = ref<boolean>(false);

  const handleClose = ():void => {
    if (mobileWidth()) showMobileForm.value = false;
    else closeWallet();
  }

  const showNotAvailableText = computed(() => {
    return (!depositMethods.value?.length && selectedTab.value === 'deposit')
      || (!withdrawMethods.value?.length && selectedTab.value === 'withdraw');
  })

  // << GET CONTENT FOR DEPOSIT LIMIT
  const currentLocaleLimitsContent = ref<Maybe<IProfileLimits['coolingOff']>>();
  const defaultLocaleLimitsContent = ref<Maybe<IProfileLimits['coolingOff']>>();

  const getLimitContent = async ():Promise<void> => {
    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'limits').only(['coolingOff']).findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'limits').only(['coolingOff']).findOne()
    ]);

    if (currentLocaleContentResponse.status !== 'rejected') {
      currentLocaleLimitsContent.value = currentLocaleContentResponse.value as IProfileLimits['coolingOff'];
    }

    if (defaultLocaleContentResponse.status !== 'rejected') {
      defaultLocaleLimitsContent.value = defaultLocaleContentResponse.value as IProfileLimits['coolingOff'];
    }
  }

  onMounted(() => {
    getLimitContent();
  })
  // >>
</script>

<style src="~/assets/styles/components/modal/wallet.scss" lang="scss"/>
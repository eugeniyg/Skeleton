<template>
  <vue-final-modal
    v-model="modals.wallet"
    class="wallet-modal"
    :clickToClose="false"
  >
    <div class="wallet-modal__container">
      <div class="wallet-modal__slot-left">
        <div class="wallet-modal__slot-left__header">
          <button-modal-close @close="closeWallet" />

          <wallet-tabs
            v-if="showTabs"
            :items="tabItems"
            :selected="selectedTab"
            @changeTab="changeTab"
          />
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
          />

          <form-input-payments
            v-if="selectedTab === 'withdraw'"
            :items="withdrawMethods"
            v-model:activeMethod="currentWithdrawMethod"
          />
        </balance>

        <wallet-dots
          :itemsCount="2"
          :activeIndex="0"
        />
      </div>

      <div class="wallet-modal__slot-right">
        <div class="wallet-modal__slot-right__header">
          <wallet-tabs
            v-if="showTabs"
            :items="tabItems"
            :selected="selectedTab"
            @changeTab="changeTab"
          />

          <button-modal-close @close="closeWallet" />
          <wallet-header v-bind="cashHeaderProps"/>
          <div class="identity">ID {{ playerIdentity }}</div>
        </div>

        <div class="wallet-modal__slot-right__header-secondary">
          <div class="wallet-modal__slot-right__header-secondary__title">
            {{ modalTitle }}
          </div>

          <div class="identity">ID {{ playerIdentity }}</div>
        </div>

        <template v-if="selectedTab === 'deposit'">
          <wallet-limit
            v-if="depositLimitError"
            :currentLocaleLimitsContent="currentLocaleLimitsContent"
            :defaultLocaleLimitsContent="defaultLocaleLimitsContent"
          />

          <template v-else-if="depositMethods?.length">
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
            {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.emptyDepositMethods') }}
          </div>
        </template>

        <template v-else-if="selectedTab === 'withdraw'">
          <form-withdraw
            v-if="withdrawMethods?.length"
            :key="currentWithdrawMethod.method"
            v-bind="currentWithdrawMethod"
          />
          <div v-else class="modal-withdraw__empty-methods">
            {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.withdraw.emptyWithdrawMethods') }}
          </div>
        </template>

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
  import { IPaymentMethod } from '@skeleton/core/types';
  import { IProfileLimits } from '~/types';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const walletStore = useWalletStore();
  const profileStore = useProfileStore();
  const { modals, walletModalType, depositLimitError } = storeToRefs(layoutStore);
  const { showModal, closeModal } = layoutStore;
  const { depositMethods, withdrawMethods } = storeToRefs(walletStore);
  const { profile } = storeToRefs(profileStore);
  const currentDepositMethod = ref<IPaymentMethod>({} as IPaymentMethod);
  const currentWithdrawMethod = ref<IPaymentMethod>({} as IPaymentMethod);

  const globalStore = useGlobalStore();
  const {
    currentLocale,
    defaultLocale,
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const depositMethodKey = ref<number>(0);

  const selectedTab = ref<string>(walletModalType?.value || 'deposit');

  watch(() => depositMethods.value, () => {
    currentDepositMethod.value = depositMethods.value[0] || {};
    depositMethodKey.value += 1;
  });

  watch(() => withdrawMethods.value, () => {
    currentWithdrawMethod.value = withdrawMethods.value[0] || {};
  });

  const changeTab = (tabId: 'deposit'|'withdraw'): void => {
    walletModalType.value = tabId === 'withdraw' ? tabId : undefined;
  };

  watch(() => walletModalType?.value, () => {
    selectedTab.value = walletModalType?.value || 'deposit';
  })

  const showTabs = computed(() => {
    return walletModalType?.value !== 'deposit';
  });

  const cashHeaderProps = {
    src: '/img/cash/cards.svg',
    title: 'Deposit',
    subTitle: 'Bank card',
  };

  const modalTitle = computed(() => {
    return selectedTab.value === 'deposit'
      ? getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.deposit.title')
      : getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.withdraw.title')
  })

  const playerIdentity = computed(() => {
    if (!profile.value?.id) return '';
    return profile.value.id.split('-')[0].toUpperCase();
  })

  const tabItems = computed(() => {
    const contentTabs = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.tabs') || {};
    return Object.keys(contentTabs).map(key => ({ id: key, label: contentTabs[key] }));
  })

  const closeWallet = (): void => {
    if (walletModalType?.value === 'deposit') {
      showModal('cancelDeposit');
    } else {
      closeModal('wallet');
    }
  }

  // << GET CONTENT FOR DEPOSIT LIMIT
  interface ILimitContent {
    definition: IProfileLimits['definition'],
    periodOptions: IProfileLimits['periodOptions']
  }

  const currentLocaleLimitsContent = ref<Maybe<ILimitContent>>();
  const defaultLocaleLimitsContent = ref<Maybe<ILimitContent>>();

  const getLimitContent = async ():Promise<void> => {
    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'limits').only(['definition', 'periodOptions']).findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'limits').only(['definition', 'periodOptions']).findOne()
    ]);

    if (currentLocaleContentResponse.status !== 'rejected') {
      currentLocaleLimitsContent.value = currentLocaleContentResponse.value as ILimitContent;
    }

    if (defaultLocaleContentResponse.status !== 'rejected') {
      defaultLocaleLimitsContent.value = defaultLocaleContentResponse.value as ILimitContent;
    }
  }

  onMounted(() => {
    getLimitContent();
  })
  // >>
</script>

<style src="~/assets/styles/components/modal/wallet.scss" lang="scss"/>
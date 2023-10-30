<template>
  <vue-final-modal
    v-model="modals.wallet"
    class="wallet-modal"
    :clickToClose="false"
  >
    <div class="wallet-modal__container">
      <div class="wallet-modal__slot-left">
        <div class="wallet-modal__slot-left__header">
          <button-modal-close @close="closeModal('wallet')" />

          <wallet-tabs
            :items="cashTabsItems"
            :selected="selectedTab"
            @change-tab="changeTab"
          />
        </div>

        <!--        <wallet-region v-bind="chooseRegionProps">-->
        <!--          <div class="identity">-->
        <!--            ID {{ playerIdentity }}-->
        <!--          </div>-->
        <!--        </wallet-region>-->

        <balance>
          <form-input-payments
            :items="depositMethods"
            v-model:activeMethod="currentMethod"
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
            :items="cashTabsItems"
            :selected="selectedTab"
            @change-tab="changeTab"
          />

          <button-modal-close @close="closeModal('wallet')"/>
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
          <template v-if="depositMethods?.length">
            <form-deposit
              :key="`${currentMethod.method}-${methodKey}`"
              v-if="currentMethod.type === 'form'"
              v-bind="currentMethod"
            />

            <form-deposit-crypto
              v-if="currentMethod.type === 'address'"
              v-bind="currentMethod"
              :key="`${currentMethod.method}-${methodKey}`"
            />
          </template>

          <div v-else class="wallet-modal__empty-methods">
            {{ getContent(popupsData, defaultLocalePopupsData, 'deposit.emptyDepositMethods') }}
          </div>
        </template>

        <template v-else>
          <form-withdraw
            v-if="withdrawMethods?.length"
            :key="currentMethod.method"
            v-bind="currentMethod"
          />
          <div v-else class="modal-withdraw__empty-methods">
            {{ getContent(popupsData, defaultLocalePopupsData, 'withdrawal.emptyWithdrawMethods') }}
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
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const walletStore = useWalletStore();
  const profileStore = useProfileStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { depositMethods, withdrawMethods } = storeToRefs(walletStore);
  const { profile } = storeToRefs(profileStore);
  const currentMethod = ref<IPaymentMethod>({} as IPaymentMethod);

  const {
    popupsData,
    defaultLocalePopupsData
  } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const methodKey = ref<number>(0);

  watch(() => depositMethods.value, () => {
    currentMethod.value = depositMethods.value[0] || {};
    methodKey.value += 1;
  });

  watch(() => withdrawMethods.value, () => {
    currentMethod.value = withdrawMethods.value[0] || {};
  });

  const selectedTab = ref('deposit');

  const cashTabsItems = [
    {
      id: 'deposit',
      label: 'Deposit'
    },
    {
      id: 'withdraw',
      label: 'Withdraw'
    }
  ];

  const cashHeaderProps = {
    src: '/img/cash/cards.svg',
    title: 'Deposit',
    subTitle: 'Bank card',
  };

  const cashIdProps = {
    label: 'ID',
    id: 18265490,
  };

  const changeTab = (id: string) => {
    selectedTab.value = id;
  };

  const modalTitle = computed(() => {
    return selectedTab.value === 'deposit'
      ? getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.title')
      : getContent(popupsData, defaultLocalePopupsData, 'wallet.withdraw.title')
  })

  const playerIdentity = computed(() => {
    if (!profile.value?.id) return '';
    return profile.value.id.split('-')[0].toUpperCase();
  })
</script>

<style src="~/assets/styles/components/modal/wallet.scss" lang="scss"/>
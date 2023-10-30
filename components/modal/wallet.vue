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
        <!--            ID {{ cashIdProps.id }}-->
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
          <div class="identity">ID {{ cashIdProps.id }}</div>
        </div>

        <div class="wallet-modal__slot-right__header-secondary">
          <div class="wallet-modal__slot-right__header-secondary__title">
            {{ getContent(popupsData, defaultLocalePopupsData, 'deposit.title') }}
          </div>

          <div class="identity">ID {{ cashIdProps.id }}</div>
        </div>

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
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { depositMethods } = storeToRefs(walletStore);
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
</script>

<style src="~/assets/styles/components/modal/wallet.scss" lang="scss"/>
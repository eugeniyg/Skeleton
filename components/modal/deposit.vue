<template>
  <vue-final-modal
    v-model="modals.deposit"
    class="cash-modal"
    :clickToClose="false"
  >
    <div class="cash-modal__container">
      <div class="cash-modal__slot-left">
        <div class="cash-modal__slot-left__header">
          <button-modal-close @close="closeModal('deposit')"/>
          <cash-tabs
            :items="cashTabsItems"
            :selected="selectedTab"
            @change-tab="changeTab"
          />
        </div>
        
        <cash-choose-region v-bind="chooseRegionProps">
          <cash-id v-bind="cashIdProps"/>
        </cash-choose-region>
        
        <balance>
          <form-input-payments
            :items="depositMethods"
            v-model:activeMethod="currentMethod"
          />
        </balance>
        
        <cash-dots
          :itemsCount="2"
          :activeIndex="0"
        />
      </div>
      
      <div class="cash-modal__slot-right">
        <div class="cash-modal__slot-right__header">
          <cash-tabs
            :items="cashTabsItems"
            :selected="selectedTab"
            @change-tab="changeTab"
          />
          <button-modal-close @close="closeModal('deposit')"/>
          <cash-header v-bind="cashHeaderProps"/>
          <cash-id v-bind="cashIdProps"/>
        </div>
        
        <div class="cash-modal__slot-right__header-secondary">
          <div class="cash-modal__slot-right__header-secondary__title">
            {{ getContent(popupsData, defaultLocalePopupsData, 'deposit.title') }}
          </div>
          <cash-id v-bind="cashIdProps"/>
        </div>
        
        <cash-reached-limit/>
        
        <template v-if="depositMethods?.length">
          <form-deposit
            :key="methodKey"
            v-if="currentMethod.type === 'form'"
            v-bind="currentMethod"
          />
          
          <form-deposit-crypto
            v-if="currentMethod.type === 'address'"
            v-bind="currentMethod"
            :key="`${currentMethod.method}-${methodKey}`"
          />
        </template>
        <div v-else class="cash-modal__empty-methods">
          {{ getContent(popupsData, defaultLocalePopupsData, 'deposit.emptyDepositMethods') }}
        </div>
        
        <cash-dots
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
    },
    {
      id: 'tips',
      label: 'Tips'
    }
  ];
  
  const chooseRegionProps = {
    src: '/img/cash/logo.svg',
    label: 'Payment methods for the region',
    title: 'United States (USA)',
    linkText: 'Change',
  };
  
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

<style src="~/assets/styles/components/modal/cash.scss" lang="scss"/>


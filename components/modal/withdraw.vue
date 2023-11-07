<template>
  <vue-final-modal
    v-model="modals.withdraw"
    class="modal-withdraw"
    :clickToClose="false"
  >
    <div class="container">
      <div class="slot">
        <balance withdraw>
          <form-input-payments
            :items="withdrawMethods"
            v-model:activeMethod="currentMethod"
          />
        </balance>
      </div>

      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('withdraw')"/>
          <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'withdrawal.title') }}</div>
        </div>

        <form-withdraw
          v-if="withdrawMethods?.length"
          :key="currentMethod.method"
          v-bind="currentMethod"
        />
        <div v-else class="modal-withdraw__empty-methods">
          {{ getContent(popupsData, defaultLocalePopupsData, 'withdrawal.emptyWithdrawMethods') }}
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IPaymentMethod } from '@skeleton/core/types';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const walletStore = useWalletStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { withdrawMethods } = storeToRefs(walletStore);
  const currentMethod = ref<IPaymentMethod>({} as IPaymentMethod);

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  watch(() => withdrawMethods.value, () => {
    currentMethod.value = withdrawMethods.value[0] || {};
  });
</script>

<style src="~/assets/styles/components/modal/withdraw.scss" lang="scss" />


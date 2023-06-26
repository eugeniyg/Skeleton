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
          <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'withdraw.title') }}</div>
        </div>

        <form-withdraw
          v-if="withdrawMethods?.length"
          :key="currentMethod.method"
          v-bind="currentMethod"
        />
        <div v-else class="modal-withdraw__empty-methods">
          {{ getContent(popupsData, defaultLocalePopupsData, 'withdraw.emptyWithdrawMethods') }}
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PaymentMethodInterface } from '@platform/frontend-core/dist/module';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const walletStore = useWalletStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { withdrawMethods } = storeToRefs(walletStore);
  const currentMethod = ref<PaymentMethodInterface>({} as PaymentMethodInterface);

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  watch(() => withdrawMethods.value, () => {
    currentMethod.value = withdrawMethods.value[0] || {};
  });
</script>

<style src="~/assets/styles/components/modal/withdraw.scss" lang="scss" />


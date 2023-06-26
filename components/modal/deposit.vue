<template>
  <vue-final-modal
    v-model="modals.deposit"
    class="modal-deposit"
    :clickToClose="false"
  >
    <div class="container">
      <div class="slot">
        <balance>
          <form-input-payments
            :items="depositMethods"
            v-model:activeMethod="currentMethod"
          />
        </balance>
      </div>

      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('deposit')"/>
          <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'deposit.title') }}</div>
        </div>

        <template v-if="depositMethods?.length">
          <form-deposit
            :key="methodKey"
            v-if="currentMethod.type === 'form'"
            v-bind="currentMethod"
          />
          <!--          <form-deposit-additional/>-->
          <form-deposit-crypto
            v-if="currentMethod.type === 'address'"
            v-bind="currentMethod"
            :key="`${currentMethod.method}-${methodKey}`"
          />
        </template>
        <div v-else class="modal-deposit__empty-methods">
          {{ getContent(popupsData, defaultLocalePopupsData, 'deposit.emptyDepositMethods') }}
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
  const { depositMethods } = storeToRefs(walletStore);
  const currentMethod = ref<PaymentMethodInterface>({} as PaymentMethodInterface);

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const methodKey = ref<number>(0);
  watch(() => depositMethods.value, () => {
    currentMethod.value = depositMethods.value[0] || {};
    methodKey.value += 1;
  });
</script>

<style src="~/assets/styles/components/modal/deposit.scss" lang="scss" />


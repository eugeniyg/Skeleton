<template>
  <vue-final-modal
    v-model="modals.deposit"
    @beforeOpen="showForm = true"
    @closed="showForm = false"
    esc-to-close
  >
    <div class="modal-deposit">
      <div v-if="isLoggedIn" class="container">
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
            <div class="title">Deposit</div>
          </div>
          <form-deposit v-if="showForm" v-bind="currentMethod"/>
          <!--          <form-deposit-additional/>-->
          <!--          <form-deposit-crypto/>-->
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PaymentMethodInterface } from '@platform/frontend-core/dist/module';

  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { modals } = storeToRefs(layoutStore);
  const { isLoggedIn } = storeToRefs(profileStore);
  const { closeModal } = layoutStore;
  const { depositMethods } = storeToRefs(walletStore);
  const currentMethod = ref<PaymentMethodInterface>({} as PaymentMethodInterface);
  const showForm = ref<boolean>(false);

  watch(() => depositMethods.value, () => {
    currentMethod.value = depositMethods.value[0] || {};
  });

</script>

<style lang="scss" src="./style.scss"/>

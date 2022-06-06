<template>
  <vue-final-modal
    v-model="modals.deposit"
    :close="closeModal('deposit')"
    @click="closeModal('deposit')"
  >
    <div class="modal-deposit" @click.stop>
      <div class="container">
        <div class="slot">
          <!--          <balance :balance="balance">-->
          <!--            <input-payments :options="depositItems" @input="onSelectPayment"></input-payments>-->
          <!--          </balance>-->
        </div>
        <div class="scroll">
          <div class="header">
            <button-modal-close @close="closeModal('deposit')"/>
            <div class="title">Deposit</div>
          </div>
          <!--          <form-deposit></form-deposit>&lt;!&ndash; Additional info&ndash;&gt;-->
          <!--          <form-deposit-additional></form-deposit-additional>-->
          <!--          <form-deposit-crypto></form-deposit-crypto>-->
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  // import InputPayments from '@/components/forms/inputs/input-payments';
  // import Balance from '@/components/balance';
  // import FormDeposit from '@/components/forms/form-deposit';
  // import FormDepositAdditional from '@/components/forms/form-deposit-additional';
  // import FormDepositCrypto from '@/components/forms/form-deposit-crypto';

  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
</script>

<style lang="scss" src="./style.scss"/>

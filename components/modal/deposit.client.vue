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
            <div class="title">{{ depositContent?.title }}</div>
          </div>
          <form-deposit v-if="showForm && currentMethod.type === 'form'" v-bind="currentMethod"/>
          <!--          <form-deposit-additional/>-->
          <form-deposit-crypto
            v-if="showForm && currentMethod.type === 'address'"
            v-bind="currentMethod"
            :key="currentMethod.method"
          />
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PaymentMethodInterface } from '@platform/frontend-core/dist/module';
  import { DepositInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { modals } = storeToRefs(layoutStore);
  const { isLoggedIn } = storeToRefs(profileStore);
  const { closeModal } = layoutStore;
  const { depositMethods } = storeToRefs(walletStore);
  const currentMethod = ref<PaymentMethodInterface>({} as PaymentMethodInterface);
  const showForm = ref<boolean>(false);

  const { popupsData } = useGlobalStore();
  const depositContent: DepositInterface|undefined = popupsData?.deposit;

  watch(() => depositMethods.value, () => {
    currentMethod.value = depositMethods.value[0] || {};
  });

</script>

<style lang="scss">
.modal-deposit {
  @extend %modal;

  .header {
    .btn-modal-close {
      --top: 16px;
      --right: 8px;

      @include media(md)  {
        --top: -8px;
        --right: -16px;
      }
    }
  }

  .list-currencies {
    .header {
      border-bottom: 1px solid var(--gray-700);
      display: flex;
      padding: 0 0 rem(8px) 0;
      grid-column-gap: rem(4px);
      margin-bottom: rem(8px);
      position: relative;
    }
  }
}
</style>

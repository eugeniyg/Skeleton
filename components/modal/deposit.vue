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
          <div class="title">{{ depositContent?.title }}</div>
        </div>

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
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PaymentMethodInterface } from '@platform/frontend-core/dist/module';
  import { VueFinalModal } from 'vue-final-modal';
  import { DepositInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const walletStore = useWalletStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { depositMethods } = storeToRefs(walletStore);
  const currentMethod = ref<PaymentMethodInterface>({} as PaymentMethodInterface);

  const { popupsData } = useGlobalStore();
  const depositContent: Maybe<DepositInterface> = popupsData?.deposit;

  const methodKey = ref<number>(0);
  watch(() => depositMethods.value, () => {
    currentMethod.value = depositMethods.value[0] || {};
    methodKey.value += 1;
  });
</script>

<style lang="scss">
.modal-deposit {
  @extend %modal;

  .header {
    padding: rem(4px) rem(8px) 0 rem(8px);

    @include media(md) {
      padding: 0;
    }

    .btn-modal-close {
      --top: 24px;
      --right: auto;
      --bg: var(--gray-800);

      @include media(md) {
        --bg: var(--gray-900);
        --top: -16px;
        --right: -8px;
        transform: none;
      }

      .icon {
        &:first-of-type {
          color: var(--color, var(--white));
          --visibility: visible;
        }

        &:last-of-type {
          --visibility: hidden;
        }

        @include media(md) {
          &:first-of-type {
            --visibility: hidden;
            color: var(--color, var(--gray-400));
          }

          &:last-of-type {
            --visibility: visible;
          }
        }
      }
    }
  }

  .container {
    .scroll {
      padding-left: 0;
      padding-right: 0;

      @include media(md) {
        padding-top: rem(20px);
        padding-left: rem(16px);
        padding-right: rem(16px);
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

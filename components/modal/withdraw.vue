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
          <div class="title">{{ withdrawContent?.title }}</div>
        </div>

        <form-withdraw :key="currentMethod.method" v-bind="currentMethod" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PaymentMethodInterface } from '@platform/frontend-core/dist/module';
  import { VueFinalModal } from 'vue-final-modal';
  import { WithdrawInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const walletStore = useWalletStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { withdrawMethods } = storeToRefs(walletStore);
  const currentMethod = ref<PaymentMethodInterface>({} as PaymentMethodInterface);

  const { popupsData } = useGlobalStore();
  const withdrawContent: WithdrawInterface|undefined = popupsData?.withdraw;

  watch(() => withdrawMethods.value, () => {
    currentMethod.value = withdrawMethods.value[0] || {};
  });
</script>

<style lang="scss">
.modal-withdraw {
  @extend %modal;

  .vfm__content {
    max-width: rem(400px);
    width: 100%;

    @include media(md) {
      max-width: rem(664px);
    }
  }

  .titles {
    margin-bottom: rem(16px);
  }

  .container {
    .scroll {
      border: 0;

      @include media(md) {
          border: 8px solid var(--gray-900);
      }
    }
  }

  .header {
    padding: 4px 8px 0 8px;

    @include media(md)  {
      padding: 0;
    }

    .btn-modal-close {
      left: 8px;
      --top: 24px;
      --right: auto;
      --bg: var(--gray-800);

      @include media(md) {
        left: auto;
        --bg: var(--gray-900);
        --top: -16px;
        --right: -16px;
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
            color: var(--color, var(--gray-400));
            --visibility: hidden;
          }

          &:last-of-type {
            --visibility: visible;
          }
        }
      }
    }
  }
}
</style>

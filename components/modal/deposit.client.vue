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
  const depositContent: DepositInterface | undefined = popupsData?.deposit;

  watch(() => depositMethods.value, () => {
    currentMethod.value = depositMethods.value[0] || {};
  });

</script>

<style lang="scss">
.modal-deposit {
  @extend %modal;

  .header {
    padding: rem(4px) rem(16px) 0 rem(16px);

    @include media(md) {
      padding: 0;
    }

    .btn-modal-close {
      --top: 24px;
      --right: auto;
      --bg: var(--gray-800);

      @include media(md) {
        --bg: var(--gray-900);
        --top: -4px;
        --right: -16px;
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
      @include media(md) {
        padding-top: rem(20px);
      }
    }
  }
}
</style>

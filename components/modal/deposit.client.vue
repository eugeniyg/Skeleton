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

          <form-input-dropdown
            class="dropdown-network"
            v-bind="networkSelect"
            v-model:value="selectedNetwork"
            @input="selectNetwork"
          />

          <!--<form-deposit-additional/>-->

          <div class="dropdown-network__content">

            <div class="dropdown-network__info" v-if="!selectedNetwork">
              To continue,<br>
              select network 👆👆👆
            </div>
            <template v-else>
              <form-deposit-crypto
                v-if="showForm && currentMethod.type === 'address'"
                v-bind="currentMethod"
                :key="currentMethod.method"
              />
            </template>
          </div>
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

  const networkSelect = ref({
    placeholder: 'Network',
    name: 'networkSelect',
    label: 'Select your network',
    options: [
      {
        mask: '/img/currency/BTC.svg',
        code: 'BTC',
        value: 'BTC',
      },
      {
        mask: '/img/currency/USD.svg',
        code: 'USD',
        value: 'USD',
      }],
  });

  const selectedNetwork = ref('');

  const selectNetwork = (value: string) => {
    console.log(value);
  };

</script>

<style lang="scss">
.modal-deposit {
  @extend %modal;

  .scroll {
    padding: 0 rem(8px);

    @include media(md) {
      padding: rem(16px);
    }
  }
}

.dropdown-network {
  margin-bottom: rem(24px);

  &__content {
    min-height: 200px;
  }

  &__info {
    @include font($heading-4);
    color: var(--white);
    text-align: center;
  }
}
</style>

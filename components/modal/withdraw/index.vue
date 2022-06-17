<template>
  <vue-final-modal
    v-model="modals.withdraw"
    @click="closeModal('withdraw')"
    esc-to-close
  >
    <div class="modal-withdraw" @click.stop>
      <div v-if="isLoggedIn" class="container">
        <div class="slot">
          <balance :withdraw="true">
            <form-input-payments
              :items="depositMethods"
              v-model:activeMethod="currentMethod"
            />
          </balance>
        </div>

        <div class="scroll">
          <div class="header">
            <button-modal-close @close="closeModal('withdraw')"/>
            <div class="title">Withdraw</div>
          </div>

          <atomic-titles :title="selected.title"/>
          <form v-if="selected.value === 'interac'">
            <form-input-number
              :is-required="false"
              label="Withdraw sum"
              name="name10"
              :hint="{message: 'Min deposit = 20 EUR, max deposit = 5000 EUR'}"
            />

            <form-input-text
              type="email"
              :is-required="true"
              label="Email Address"
              name="email"
              placeholder="Enter your email"
            />

            <form-input-phone
              label="Mobile phone"
              placeholder="Phone number"
              :isRequired="true"
            />
            <button-base type="primary" size="md">Withdraw 20 EUR</button-base>
          </form>

          <form v-if="selected.value === 'mifinity' || selected.value === 'coinspaid'">
            <form-input-number
              label="Withdraw sum"
              name="name11"
              :hint="{message: 'Min deposit = 20 EUR, max deposit = 5000 EUR'}"
            />
            <form-input-text label="Destination Account" placeholder="Enter bank name"/>
            <button-base type="primary" size="md">Withdraw 20 EUR</button-base>
          </form>

          <form v-if="selected.value === 'etransfer'">
            <form-input-number
              :is-required="false"
              label="Withdraw sum"
              name="name12"
              :hint="{message: 'Min deposit = 20 EUR, max deposit = 5000 EUR'}"
            />

            <form-input-text
              type="text"
              :is-required="false"
              label="Bank Name"
              name="bank-name"
              placeholder="Enter bank name"
            />

            <form-input-text
              type="text"
              :is-required="false"
              label="Branch Address"
              name="branch-addresss"
              placeholder="Enter branch address"
            />

            <form-input-text
              type="text"
              :is-required="false"
              label="BIC/SWIFT"
              name="bic-swift"
              placeholder="Enter BIC/SWIFT"
            />

            <form-input-text
              type="text"
              :is-required="false"
              label="Account number"
              name="account-number"
              placeholder="Enter BIC/SWIFT"
            />

            <form-input-text
              type="text"
              :is-required="false"
              label="Beneficiary name"
              name="beneficiary-name"
              placeholder="Enter beneficiary name"
            />
            <button-base type="primary" size="md">Withdraw 20 EUR</button-base>
          </form>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { modals } = storeToRefs(layoutStore);
  const { isLoggedIn } = storeToRefs(profileStore);
  const { closeModal } = layoutStore;
  const { depositMethods } = storeToRefs(walletStore);
  const currentMethod = ref<any>({});

  const selected = {
    title: 'etransfer',
    value: 'etransfer',
    mask: '/svg/payment-systems/e-transfer.svg',
    balance: { value: 100.40, title: 'EUR' },
    withdraw: { value: 77.73, title: 'EUR' },
  };
</script>

<style lang="scss" src="./style.scss"/>

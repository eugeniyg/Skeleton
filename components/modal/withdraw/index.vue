<template>
  <vue-final-modal
    v-model="modals.withdraw"
    @beforeOpen="showForm = true"
    @closed="showForm = false"
    esc-to-close
  >
    <div class="modal-withdraw">
      <div v-if="isLoggedIn" class="container">
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

          <atomic-titles :title="currentMethod.names?.en"/>
          <form-withdraw v-if="showForm" v-bind="currentMethod" />

          <!--          <form>-->
          <!--            <form-input-number-->
          <!--              label="Withdraw sum"-->
          <!--              name="withdrawSum"-->
          <!--              :min="currentMethod.amountMin"-->
          <!--              :max="currentMethod.amountMax"-->
          <!--              v-model:value.number="amountValue"-->
          <!--              :currency="currentCurrency"-->
          <!--              :hint="fieldHint"-->
          <!--            />-->

          <!--            <form-input-text-->
          <!--              type="email"-->
          <!--              :is-required="true"-->
          <!--              label="Email Address"-->
          <!--              name="email"-->
          <!--              placeholder="Enter your email"-->
          <!--            />-->

          <!--            <form-input-phone-->
          <!--              label="Mobile phone"-->
          <!--              placeholder="Phone number"-->
          <!--              :isRequired="true"-->
          <!--            />-->
          <!--            <button-base-->
          <!--              type="primary"-->
          <!--              size="md"-->
          <!--              :isDisabled="buttonDisabled"-->
          <!--              @click="getWithdraw"-->
          <!--            >-->
          <!--              Withdraw {{ buttonAmount }} {{ currentCurrency }}-->
          <!--            </button-base>-->
          <!--          </form>-->

          <!--          <form v-if="selected.value === 'etransfer'">-->
          <!--            <form-input-number-->
          <!--              :is-required="false"-->
          <!--              label="Withdraw sum"-->
          <!--              name="name12"-->
          <!--              :hint="{message: 'Min deposit = 20 EUR, max deposit = 5000 EUR'}"-->
          <!--            />-->

          <!--            <form-input-text-->
          <!--              type="text"-->
          <!--              :is-required="false"-->
          <!--              label="Bank Name"-->
          <!--              name="bank-name"-->
          <!--              placeholder="Enter bank name"-->
          <!--            />-->

          <!--            <form-input-text-->
          <!--              type="text"-->
          <!--              :is-required="false"-->
          <!--              label="Branch Address"-->
          <!--              name="branch-addresss"-->
          <!--              placeholder="Enter branch address"-->
          <!--            />-->

          <!--            <form-input-text-->
          <!--              type="text"-->
          <!--              :is-required="false"-->
          <!--              label="BIC/SWIFT"-->
          <!--              name="bic-swift"-->
          <!--              placeholder="Enter BIC/SWIFT"-->
          <!--            />-->

          <!--            <form-input-text-->
          <!--              type="text"-->
          <!--              :is-required="false"-->
          <!--              label="Account number"-->
          <!--              name="account-number"-->
          <!--              placeholder="Enter BIC/SWIFT"-->
          <!--            />-->

          <!--            <form-input-text-->
          <!--              type="text"-->
          <!--              :is-required="false"-->
          <!--              label="Beneficiary name"-->
          <!--              name="beneficiary-name"-->
          <!--              placeholder="Enter beneficiary name"-->
          <!--            />-->
          <!--            <button-base type="primary" size="md">Withdraw 20 EUR</button-base>-->
          <!--          </form>-->
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PaymentMethodInterface } from '@platform/frontend-core/dist/module';
  import { WithdrawInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { modals } = storeToRefs(layoutStore);
  const { isLoggedIn } = storeToRefs(profileStore);
  const { closeModal } = layoutStore;
  const { withdrawMethods } = storeToRefs(walletStore);
  const showForm = ref<boolean>(false);
  const currentMethod = ref<PaymentMethodInterface>({} as PaymentMethodInterface);

  const { popupsData } = useGlobalStore();
  const withdrawContent: WithdrawInterface|undefined = popupsData?.withdraw;

  watch(() => withdrawMethods.value, () => {
    currentMethod.value = withdrawMethods.value[0] || {};
  });
</script>

<style lang="scss" src="./style.scss"/>

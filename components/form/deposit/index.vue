<template>
  <form class="form-deposit">
    <form-input-number
      :hint="fieldHint"
      label="Deposit sum"
      name="depositAmount"
      :min="props.amountMin"
      :max="props.amountMax"
      v-model:value.number="amountValue"
      :currency="currentCurrency"
      :is-bigger="true"
    >
      <template v-slot:pills>
        <list-pills @select="amountValue = $event" :items="[50, 100, 500, 1000]" :selected="Number(amountValue)"/>
      </template>
    </form-input-number>

    <atomic-divider/>
    <atomic-bonus/>
    <atomic-divider/>
    <div class="row">
      <form-input-toggle
        name="bonus-toggle"
        v-model:value="hasBonusCode"
        @change="hasBonusCode = !hasBonusCode"
      >
        I have bonus code
      </form-input-toggle>

      <form-input-text
        v-if="hasBonusCode"
        v-model:value="bonusValue"
        label=""
        placeholder="Enter bonus code"
        name="bonus-code"
      />
    </div>
    <button-base
      type="primary"
      size="md"
      :isDisabled="buttonDisabled"
      @click="getDeposit"
    >
      Deposit {{ buttonAmount }} {{ currentCurrency }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useWalletApi } from '~/CORE/index';

  const props = defineProps({
    amountMax: {
      type: Number,
      required: false,
    },
    amountMin: {
      type: Number,
      required: false,
    },
    method: {
      type: String,
      required: false,
    },
  });

  const walletStore = useWalletStore();
  const { showModal } = useLayoutStore();
  const { activeAccount } = storeToRefs(walletStore);
  const currentCurrency = computed(() => activeAccount.value.formatBalance.currency);
  const fieldHint = computed(() => ({
    message: `Min deposit = ${props.amountMin} ${currentCurrency.value}, max deposit = ${props.amountMax} ${currentCurrency.value}`,
  }));

  const isSending = ref<boolean>(false);
  const amountValue = ref<number>(50);
  const hasBonusCode = ref<boolean>(false);
  const bonusValue = ref<string>('');
  const buttonAmount = computed(() => {
    if (amountValue.value > props.amountMax) return props.amountMax;
    if (amountValue.value < props.amountMin) return props.amountMin;
    return amountValue.value;
  });
  const buttonDisabled = computed(() => amountValue.value < props.amountMin || amountValue.value > props.amountMax || isSending.value);

  const getDeposit = async ():Promise<void> => {
    if (buttonDisabled.value) return;

    isSending.value = true;
    const locationQuery = window.location.search;
    const successRedirect = `${window.location.href}${locationQuery ? '&' : '?'}success=deposit`;
    const errorRedirect = `${window.location.href}${locationQuery ? '&' : '?'}error=deposit`;
    const params = {
      method: props.method,
      currency: currentCurrency.value,
      amount: amountValue.value,
      accountId: activeAccount.value.id,
      redirectSuccessUrl: successRedirect,
      redirectErrorUrl: errorRedirect,
    };
    const { depositAccount } = useWalletApi();
    try {
      const depositResponse = await depositAccount(params);
      const redirectUrl = depositResponse?.[0]?.action;
      if (redirectUrl) window.location.href = redirectUrl;
    } catch {
      isSending.value = false;
      showModal('error');
    }
  };
</script>

<style lang="scss" src="./style.scss"/>

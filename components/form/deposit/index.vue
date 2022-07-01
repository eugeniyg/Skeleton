<template>
  <form class="form-deposit">
    <form-input-number
      :hint="fieldHint"
      label="Deposit sum"
      name="depositSum"
      :min="props.amountMin"
      :max="props.amountMax"
      v-model:value="amountValue"
      :currency="activeAccount.currency"
      :is-bigger="true"
    />

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
        placeholder="Enter code"
        name="bonus-code"
      />
    </div>
    <button-base
      type="primary"
      size="md"
      :isDisabled="buttonDisabled"
      @click="getDeposit"
    >
      Deposit {{ buttonAmount }} {{ activeAccount.currency }}
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
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);
  const fieldHint = computed(() => ({
    message: `Min deposit: ${props.amountMin} ${activeAccount.value.currency}`,
  }));

  const isSending = ref<boolean>(false);
  const amountValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : 0.01);
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
      currency: activeAccount.value.currency,
      amount: Number(amountValue.value),
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

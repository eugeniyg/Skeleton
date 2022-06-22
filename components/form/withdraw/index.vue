<template>
  <form>
    <form-input-number
      label="Withdraw sum"
      name="withdrawSum"
      :min="props.amountMin"
      :max="props.amountMax"
      v-model:value="amountValue"
      :currency="activeCurrency.code"
      :hint="fieldHint"
    />

    <form-input-text
      name="destAccount"
      label="Destination Account"
      type="text"
      placeholder="Enter bank name"
      v-model:value="accountNumber"
      :onFocus="onFocus('wallet_id')"
      :hint="setError('wallet_id')"
    />

    <button-base
      type="primary"
      size="md"
      :isDisabled="buttonDisabled"
      @click="getWithdraw"
    >
      Withdraw {{ buttonAmount }} {{ activeCurrency.code }}
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
  const { closeModal, showAlert } = useLayoutStore();
  const { activeAccount, activeAccountType, activeCurrency } = storeToRefs(walletStore);
  const fieldHint = computed(() => ({
    message: `Min deposit = ${props.amountMin} ${activeCurrency.value.code}, max deposit = ${props.amountMax} ${activeCurrency.value.code}`,
  }));

  const isSending = ref<boolean>(false);
  const amountValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : 0.01);
  const accountNumber = ref<string>('');
  const buttonAmount = computed(() => {
    if (amountValue.value > props.amountMax) return props.amountMax;
    if (amountValue.value < props.amountMin) return props.amountMin;
    return amountValue.value;
  });
  const buttonDisabled = computed(() => !accountNumber.value || amountValue.value < props.amountMin || amountValue.value > props.amountMax || isSending.value);

  const serverFormErrors = ref<any>({});

  const setError = (fieldName:string):undefined|{ variant: string, message: any } => {
    if (serverFormErrors.value[fieldName]) {
      return { variant: 'error', message: serverFormErrors.value[fieldName][0] };
    }
    return undefined;
  };

  const onFocus = (fieldName:string):void => {
    if (serverFormErrors.value[fieldName]) {
      serverFormErrors.value[fieldName] = undefined;
    }
  };

  const getWithdraw = async ():Promise<void> => {
    if (buttonDisabled.value) return;

    isSending.value = true;
    const params = {
      method: props.method,
      fields: [{
        key: 'wallet_id',
        value: accountNumber.value,
      }],
      currency: activeCurrency.value.code,
      amount: Number(amountValue.value),
      accountId: activeAccount.value.id,
    };

    const { withdrawAccount } = useWalletApi();

    try {
      await withdrawAccount(params);
      closeModal('withdraw');
      showAlert({
        title: 'Pending!',
        text: 'Your withdrawal is being processed. We will check your request in a short while.',
        variant: 'done',
      });
    } catch (err) {
      if (err.response?.status === 422) {
        serverFormErrors.value = err.data?.error?.fields;
      } else {
        showAlert({
          title: 'Error!',
          text: 'Something went wrong!',
          variant: 'error',
        });
      }
      isSending.value = false;
    }
  };
</script>

<template>
  <form>
    <form-input-number
      label="Withdraw sum"
      name="withdrawSum"
      :min="props.amountMin"
      :max="props.amountMax"
      v-model:value="amountValue"
      :currency="activeAccount.currency"
      :hint="fieldHint"
    />

    <form-input-text
      v-for="field in props.fields"
      :key="field.key"
      :name="field.key"
      :label="field.labels.en"
      type="text"
      :placeholder="field.hints.en"
      v-model:value="withdrawFormData[field.key]"
      :onFocus="onFocus(field.key)"
      :hint="setError(field.key)"
    />

    <button-base
      type="primary"
      size="md"
      :isDisabled="buttonDisabled"
      @click="getWithdraw"
    >
      Withdraw {{ buttonAmount }} {{ activeAccount.currency }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useGlobalMethods, useWalletApi } from '~/CORE/index';

  const props = defineProps({
    amountMax: {
      type: Number,
      required: false,
    },
    amountMin: {
      type: Number,
      required: false,
    },
    fields: {
      type: Array,
      default: () => [],
    },
    method: {
      type: String,
      required: false,
    },
  });

  const walletStore = useWalletStore();
  const { closeModal, showAlert } = useLayoutStore();
  const {
    activeAccount, activeAccountType,
  } = storeToRefs(walletStore);
  const fieldHint = computed(() => ({
    message: `Min withdraw = ${props.amountMin} ${activeAccount.value.currency}, max withdraw = ${props.amountMax} ${activeAccount.value.currency}`,
  }));

  const isSending = ref<boolean>(false);
  const amountValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : 0.01);
  const { setFormData } = useGlobalMethods();
  const withdrawFormData = reactive(setFormData(props.fields));
  const buttonAmount = computed(() => {
    if (amountValue.value > props.amountMax) return props.amountMax;
    if (amountValue.value < props.amountMin) return props.amountMin;
    return amountValue.value;
  });
  const fieldsValid = computed(() => {
    let valid = true;
    props.fields.forEach((field:any) => {
      if (field.isRequired && !withdrawFormData[field.key]) valid = false;
    });
    return valid;
  });
  const buttonDisabled = computed(() => !fieldsValid.value || amountValue.value > activeAccount.value.balance
    || amountValue.value < props.amountMin || amountValue.value > props.amountMax || isSending.value);

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
    const formatFields = Object.entries(withdrawFormData).map(([key, value]) => ({ key, value }));
    const params = {
      method: props.method,
      fields: formatFields,
      currency: activeAccount.value.currency,
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

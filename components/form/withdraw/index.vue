<template>
  <form>
    <form-input-number
      :label="withdrawContent?.sumLabel || ''"
      name="withdrawSum"
      :min="formatAmountMin.amount"
      :max="formatAmountMax.amount"
      v-model:value="amountValue"
      :defaultValue="amountDefaultValue"
      :currency="defaultInputSum.currency"
      :hint="fieldHint"
    />

    <form-input-text
      v-for="field in props.fields"
      :key="field.key"
      :name="field.key"
      :label="fieldsContent[field.key]?.label || ''"
      type="text"
      :placeholder="fieldsContent[field.key]?.placeholder || ''"
      v-model:value="withdrawFormData[field.key]"
      @focus="onFocus(field.key)"
      @blur="v$[field.key]?.$touch()"
      :hint="setError(field.key)"
    />

    <button-base
      type="primary"
      size="md"
      :isDisabled="buttonDisabled"
      @click="getWithdraw"
    >
      {{ withdrawContent?.withdrawButton }} {{ buttonAmount }} {{ defaultInputSum.currency }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { WithdrawInterface } from '~/types';

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

  const globalStore = useGlobalStore();
  const {
    popupsData, alertsData, fieldsContent,
  } = storeToRefs(globalStore);
  const withdrawContent: WithdrawInterface|undefined = popupsData.value?.withdraw;
  const walletStore = useWalletStore();
  const { closeModal, showAlert } = useLayoutStore();
  const {
    activeAccount, activeAccountType,
  } = storeToRefs(walletStore);

  const { formatBalance, getMainBalanceFormat } = useProjectMethods();
  const formatAmountMax = formatBalance(activeAccount.value.currency, props.amountMax);
  const formatAmountMin = formatBalance(activeAccount.value.currency, props.amountMin);
  const activeAccountFormat = formatBalance(activeAccount.value.currency, activeAccount.value.balance);
  const fieldHint = computed(() => ({
    message: `${withdrawContent?.minSum || ''} ${formatAmountMin.amount} ${formatAmountMin.currency}`,
  }));

  const isSending = ref<boolean>(false);
  const defaultInputSum = formatBalance(activeAccount.value.currency, 0.01);
  const amountDefaultValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : Number(defaultInputSum.amount));
  const amountValue = ref<number>(amountDefaultValue.value);
  const withdrawFormData = reactive({});
  const withdrawRules = {};
  props.fields.forEach((field:any) => {
    withdrawFormData[field.key] = '';
    withdrawRules[field.key] = [];
    if (field.isRequired) withdrawRules[field.key].push({ rule: 'required' });
    if (field.regexp) withdrawRules[field.key].push({ rule: 'regex', arguments: field.regexp });
  });
  const { getFormRules } = useProjectMethods();
  const withdrawFormRules = getFormRules(withdrawRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(withdrawFormRules, withdrawFormData);

  const buttonAmount = computed(() => {
    if (amountValue.value > formatAmountMax.amount) return formatAmountMax.amount;
    if (amountValue.value < formatAmountMin.amount) return formatAmountMin.amount;
    return amountValue.value;
  });

  const buttonDisabled = computed(() => v$.value.$invalid || amountValue.value > activeAccountFormat.amount
    || amountValue.value < formatAmountMin.amount || amountValue.value > formatAmountMax.amount || isSending.value);

  const getWithdraw = async ():Promise<void> => {
    if (buttonDisabled.value) return;

    isSending.value = true;
    const formatFields = Object.entries(withdrawFormData).map(([key, value]) => ({ key, value }));
    const mainCurrencyAmount = getMainBalanceFormat(activeAccountFormat.currency, Number(amountValue.value));
    const params = {
      method: props.method,
      fields: formatFields,
      currency: activeAccount.value.currency,
      amount: mainCurrencyAmount.amount,
      accountId: activeAccount.value.id,
    };

    const { withdrawAccount } = useCoreWalletApi();

    try {
      await withdrawAccount(params);
      closeModal('withdraw');
      showAlert(alertsData.value?.withdrawalProcessed);
    } catch (err) {
      if (err.response?.status === 422) {
        serverFormErrors.value = err.data?.error?.fields;
      } else {
        showAlert(alertsData.value?.somethingWrong);
      }
      isSending.value = false;
    }
  };
</script>

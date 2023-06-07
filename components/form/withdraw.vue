<template>
  <form class="form-withdraw">
    <form-input-dropdown
      v-if="networkSelectOptions.length"
      label="Select your network"
      :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, 'networkSelect.label')"
      v-model:value="state.selectedNetwork"
      :options="networkSelectOptions"
      class="dropdown-network"
      name="networkSelect"
      @input="onInputNetwork"
    />

    <div class="dropdown-network__info" v-if="networkSelectOptions.length && !state.selectedNetwork">
      To continue,<br>
      select network 👆👆👆
    </div>
    <div class="form-withdraw__content" :class="{'is-blured': networkSelectOptions.length && !state.selectedNetwork }">
      <form-input-number
        :label="getContent(popupsData, defaultLocalePopupsData, 'withdraw.sumLabel') || ''"
        name="withdrawSum"
        :min="formatAmountMin.amount"
        :max="formatAmountMax.amount"
        v-model:value="amountValue"
        :defaultValue="amountDefaultValue"
        :currency="defaultInputSum.currency"
        :hint="fieldHint"
      />

      <template v-for="field in props.fields">
        <form-input-text
          v-if="field.fieldType === 'input'"
          :key="field.key"
          :name="field.key"
          :label="getContent(fieldsContent, defaultLocaleFieldsContent, `${field.key}.label`) || ''"
          type="text"
          :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, `${field.key}.placeholder`) || ''"
          v-model:value="withdrawFormData[field.key]"
          @focus="onFocus(field.key)"
          @blur="v$[field.key]?.$touch()"
          :hint="setError(field.key)"
        />
      </template>




      <button-base
        type="primary"
        size="md"
        :isDisabled="buttonDisabled"
        @click="getWithdraw"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'withdraw.withdrawButton') }} {{ buttonAmount }}
        {{ defaultInputSum.currency }}
      </button-base>

      <!--      <pre style="color:white">{{ forExample }}</pre>-->
    </div>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

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
      default: '',
    },
  });

  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
    fieldsContent,
    defaultLocaleFieldsContent,
  } = storeToRefs(globalStore);

  const walletStore = useWalletStore();
  const {
    closeModal,
    showAlert
  } = useLayoutStore();
  const {
    activeAccount,
    activeAccountType,
    withdrawMethods
  } = storeToRefs(walletStore);

  const {
    formatBalance,
    getMainBalanceFormat,
    getContent
  } = useProjectMethods();
  const formatAmountMax = formatBalance(activeAccount.value?.currency, props.amountMax);
  const formatAmountMin = formatBalance(activeAccount.value?.currency, props.amountMin);
  const activeAccountFormat = formatBalance(activeAccount.value?.currency, activeAccount.value?.balance);
  const fieldHint = computed(() => ({
    message: `${getContent(popupsData, defaultLocalePopupsData, 'withdraw.minSum') || ''} ${formatAmountMin.amount} ${formatAmountMin.currency}`,
  }));

  const isSending = ref<boolean>(false);
  const defaultInputSum = formatBalance(activeAccount.value?.currency, 0.01);
  const amountDefaultValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : Number(defaultInputSum.amount));
  const amountValue = ref<number>(amountDefaultValue.value);
  const withdrawFormData = reactive<{ [key: string]: string }>({});
  const withdrawRules = ref<any>({});

  props.fields?.forEach((field: any) => {
    withdrawFormData[field.key] = '';
    withdrawRules.value[field.key] = [];
    if (field.isRequired) withdrawRules.value[field.key].push({ rule: 'required' });
    if (field.regexp) {
      withdrawRules.value[field.key].push({
        rule: 'regex',
        arguments: field.regexp
      });
    }
    if (field.key === 'wallet_id') {
      const regex = getNetworkParams('null')?.regex;
      console.log(regex);
      if (regex) {
        withdrawRules.value[field.key].push({
          rule: 'regex',
          arguments: regex
        });
      }
    }
  });

  const { getFormRules } = useProjectMethods();
  const withdrawFormRules = ref(getFormRules(withdrawRules.value));

  const state = reactive({
    selectedNetwork: null,
  });

  let {
    serverFormErrors,
    v$,
    onFocus,
    setError,
  } = useFormValidation(withdrawFormRules.value, withdrawFormData);


  const buttonAmount = computed(() => {
    if (amountValue.value > formatAmountMax.amount) return formatAmountMax.amount;
    if (amountValue.value < formatAmountMin.amount) return formatAmountMin.amount;
    return amountValue.value;
  });

  const networkSelectOptions = computed(() => {
    const select = props?.fields?.find((field) => field.fieldType === 'select');
    if (select) {
      return select?.options.map(((option) => ({
        value: option.name,
        code: String(option.id),
      })));
    }
    return [];
  });

  const buttonDisabled = computed(() => v$.value.$invalid || amountValue.value > activeAccountFormat.amount
    || amountValue.value < formatAmountMin.amount || amountValue.value > formatAmountMax.amount || isSending.value);

  const onInputNetwork = () => {
    const regex = getNetworkParams(state.selectedNetwork).regex;

    console.log('==>', state.selectedNetwork, regex);

    withdrawRules.value['wallet_id'] = [
      { rule: 'required' },
      {
        rule: 'regex',
        arguments: regex,
      }
    ];

    withdrawFormRules.value = getFormRules(withdrawRules.value);

    const  formValidation = useFormValidation(withdrawFormRules.value, withdrawFormData);
      serverFormErrors = formValidation.serverFormErrors;
      v$ = formValidation.v$;
  };

  function getNetworkParams(networkId: string) {
    const { fields } = withdrawMethods.value.find((method) => method?.fields?.length && method?.fields?.length > 1);
    if (fields) {
      const select = fields.find((item) => item.fieldType === 'select');
      if (select && select?.options) {
        return select.options.map((option) => ({
          ...option,
          id: String(option.id)
        }))
          .find((option) => option.id === networkId);
      }
    }
  }

  const getWithdraw = async (): Promise<void> => {
    if (buttonDisabled.value) return;

    isSending.value = true;
    const mainCurrencyAmount = getMainBalanceFormat(activeAccountFormat.currency, Number(amountValue.value));
    const params = {
      method: props.method,
      fields: withdrawFormData,
      currency: activeAccount.value?.currency || '',
      amount: mainCurrencyAmount.amount,
      accountId: activeAccount.value?.id || '',
    };

    const { withdrawAccount } = useCoreWalletApi();

    try {
      console.log('send ==>', params);
      // await withdrawAccount(params);
      // closeModal('withdraw');
      showAlert(alertsData.value?.withdrawalProcessed || defaultLocaleAlertsData.value?.withdrawalProcessed);
    } catch (err: any) {
      if (err.response?.status === 422) {
        serverFormErrors = err.data?.error?.fields;
      } else {
        showAlert(alertsData.value?.somethingWrong || defaultLocaleAlertsData.value?.somethingWrong);
      }
      isSending.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/form/withdraw.scss" lang="scss"/>

<template>
  <form class="form-withdraw">
    <form-input-dropdown
      v-if="networkSelectOptions?.length"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.label')"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.placeholder')"
      v-model:value="state.selectedNetwork"
      :options="networkSelectOptions"
      class="dropdown-network"
      name="networkSelect"
      @input="onInputNetwork"
    />

    <div class="dropdown-network__info"
         v-if="networkSelectOptions?.length && !state.selectedNetwork"
         v-html="marked.parse(getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.info'))"
    />

    <div class="form-withdraw__content" :class="{'is-blured': networkSelectOptions?.length && !state.selectedNetwork }">
      <form-input-number
        :label="getContent(popupsData, defaultLocalePopupsData, 'withdrawal.sumLabel') || ''"
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
          :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.key}.label`) || ''"
          type="text"
          :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.key}.placeholder`) || ''"
          v-model:value="withdrawFormData[field.key]"
          @focus="onFocus(field.key)"
          @input="v$[field.key]?.$touch()"
          :hint="setError(field.key) "
        />
      </template>

      <button-base
        type="primary"
        size="md"
        :isDisabled="buttonDisabled"
        @click="getWithdraw"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'withdrawal.withdrawButton') }} {{ buttonAmount }}
        {{ defaultInputSum.currency }}
      </button-base>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';
  import { IPaymentField } from '@platform/frontend-core';
  import { marked } from 'marked';

  const props = defineProps<{
    amountMax: number,
    amountMin: number,
    fields: IPaymentField[],
    method: string
  }>();

  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
    fieldsSettings,
    defaultLocaleFieldsSettings
  } = storeToRefs(globalStore);

  const walletStore = useWalletStore();
  const {
    closeModal,
    showAlert
  } = useLayoutStore();
  const {
    activeAccount,
    activeAccountType
  } = storeToRefs(walletStore);

  const {
    formatBalance,
    getMainBalanceFormat,
    getContent
  } = useProjectMethods();
  const formatAmountMax = formatBalance(activeAccount.value?.currency, props.amountMax);
  const formatAmountMin = formatBalance(activeAccount.value?.currency, props.amountMin);
  const activeAccountWithdrawalFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.withdrawalBalance));
  const fieldHint = computed(() => ({
    message: `${getContent(popupsData, defaultLocalePopupsData, 'withdrawal.minSum') || ''} ${formatAmountMin.amount} ${formatAmountMin.currency}`,
  }));

  const isSending = ref<boolean>(false);
  const defaultInputSum = formatBalance(activeAccount.value?.currency, 0.01);
  const amountDefaultValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : Number(defaultInputSum.amount));
  const amountValue = ref<number>(amountDefaultValue.value);

  const startFormData: Record<string, any> = {};

  props.fields.forEach((field: any) => {
    if (field.key !== 'crypto_network') startFormData[field.key] = '';
  });

  const withdrawFormData = reactive<{ [key: string]: string }>(startFormData);
  const startRules = props.fields?.reduce((currentRulesObj, currentField) => {
    if (currentField.key === 'crypto_network') return currentRulesObj;

    const rulesArr = [];
    if (currentField.isRequired) rulesArr.push({ rule: 'required' });
    if (currentField.regexp) {
      rulesArr.push({
        rule: 'regex',
        arguments: currentField.regexp
      });
    }
    if (currentField.key === 'wallet_id') {
      const findNetworkField = props.fields.find((field) => field.key === 'crypto_network');
      const firstNetworkRegex = findNetworkField ? findNetworkField.options?.[0]?.regex : undefined;

      if (firstNetworkRegex) {
        rulesArr.push({
          rule: 'regex',
          arguments: firstNetworkRegex
        });
      }
    }
    return {
      ...currentRulesObj,
      [currentField.key]: rulesArr
    };
  }, {});

  const withdrawRules = ref<any>(startRules);

  const { getFormRules } = useProjectMethods();
  const withdrawFormRules = computed(() => getFormRules(withdrawRules.value));

  const state = reactive<{selectedNetwork: string}>({
    selectedNetwork: '',
  });

  const serverFormErrors = ref<{ [key: string]: Maybe<string> }>({});
  const v$ = useVuelidate(withdrawFormRules, withdrawFormData);

  const onFocus = (fieldName: string): void => {
    if (serverFormErrors.value[fieldName]) {
      serverFormErrors.value[fieldName] = undefined;
    }
  };

  const setError = (fieldName: string): undefined | { variant: string, message: any } => {
    if (v$.value[fieldName]?.$error) {
      return {
        variant: 'error',
        message: v$.value[fieldName].$errors[0].$message
      };
    }
    if (serverFormErrors.value[fieldName]) {
      return {
        variant: 'error',
        message: serverFormErrors.value[fieldName]?.[0]
      };
    }
    return undefined;
  };

  const buttonAmount = computed(() => {
    if (amountValue.value > formatAmountMax.amount) return formatAmountMax.amount;
    if (amountValue.value < formatAmountMin.amount) return formatAmountMin.amount;
    return amountValue.value;
  });

  const networkSelectOptions = computed(() => {
    const select = props.fields.find((field) => field.fieldType === 'select');
    if (select) {
      return select?.options?.map((option) => ({
        value: option.name,
        code: option.id || `empty-network-${option.name}`,
      }));
    }
    return [];
  });

  const buttonDisabled = computed(() => v$.value.$invalid
    || amountValue.value > activeAccountWithdrawalFormat.value.amount
    || amountValue.value < formatAmountMin.amount
    || amountValue.value > formatAmountMax.amount
    || isSending.value);

  const onInputNetwork = () => {
    let networkRegex;

    const findNetworkField = props.fields.find((field) => field.key === 'crypto_network');
    if (findNetworkField) {
      const findNetworkOption = findNetworkField?.options?.find((option) => {
        if (option.id) return option.id === state.selectedNetwork;
        return state.selectedNetwork === `empty-network-${option.name}`;
      })

      networkRegex = findNetworkOption?.regex;
    }

    withdrawRules.value = {
      ...withdrawRules.value,
      'wallet_id': networkRegex ? [
        { rule: 'required' },
        {
          rule: 'regex',
          arguments: networkRegex,
        }
      ] : [{ rule: 'required' }]
    };
  };

  const getWithdraw = async (): Promise<void> => {
    if (buttonDisabled.value) return;

    const fields = state.selectedNetwork && !state.selectedNetwork.includes('empty-network') ? {
      ...withdrawFormData,
      crypto_network: state.selectedNetwork
    } : withdrawFormData;

    isSending.value = true;
    const mainCurrencyAmount = getMainBalanceFormat(activeAccountWithdrawalFormat.value.currency, Number(amountValue.value));
    const params = {
      method: props.method,
      currency: activeAccount.value?.currency || '',
      amount: mainCurrencyAmount.amount,
      accountId: activeAccount.value?.id || '',
      fields,
    };

    const { withdrawAccount } = useCoreWalletApi();

    try {
      await withdrawAccount(params);
      closeModal('withdraw');
      showAlert(alertsData.value?.wallet?.withdrawalProcessed || defaultLocaleAlertsData.value?.wallet?.withdrawalProcessed);
    } catch (err: any) {
      if (err.response?.status === 422) {
        serverFormErrors.value = err.data?.error?.fields;
      } else {
        showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
      }
      isSending.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/form/withdraw.scss" lang="scss"/>

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
        :label="getContent(popupsData, defaultLocalePopupsData, 'wallet.withdraw.sumLabel') || ''"
        name="withdrawSum"
        :min="formatAmountMin.amount"
        :max="formatAmountMax.amount"
        v-model:value="amountValue"
        :currency="formatAmountMin.currency"
        :hint="fieldHint"
      />

      <template v-for="field in visibleFields">
        <component
          v-if="field.key !== 'crypto_network'"
          :key="field.key"
          @input="v$[field.key]?.$touch()"
          @blur="v$[field.key]?.$touch()"
          @focus="onFocus(field.key)"
          :is="fieldsType[field.key]?.component || 'form-input-text'"
          v-model:value="withdrawFormData[field.key]"
          :type="fieldsType[field.key]?.type || 'text'"
          :label="field.labels[currentLocale?.code || ''] || field.labels.en"
          :name="field.key"
          :placeholder="field.hints[currentLocale?.code || ''] || field.hints.en"
          :options="getFieldOptions(field.key)"
          :isRequired="withdrawFormRules[field.key]?.hasOwnProperty('required')"
          :hint="setError(field.key)"
        />
      </template>

      <button-base
        type="primary"
        size="md"
        :isDisabled="buttonDisabled"
        @click="getWithdraw"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.withdraw.withdrawButton') }} {{ buttonAmount }}
        {{ formatAmountMin.currency }}
      </button-base>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';
  import type { IPaymentField } from '@skeleton/core/types';
  import { marked } from 'marked';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';

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
    defaultLocaleFieldsSettings,
    currentLocale
  } = storeToRefs(globalStore);

  const walletStore = useWalletStore();
  const {
    closeModal,
    showAlert
  } = useLayoutStore();
  const { activeAccount } = storeToRefs(walletStore);

  const {
    formatBalance,
    getMainBalanceFormat,
    getContent
  } = useProjectMethods();

  const networkSelectOptions = computed(() => {
    const select = props.fields.find((field) => field.fieldType === 'select');
    if (select?.options) {
      return select?.options?.map((option) => ({
        value: option.name,
        minAmount: option.minAmount,
        maxAmount: option.maxAmount,
        code: option.id || `empty-network-${option.name}`,
      }));
    }
    return [];
  });

  const state = reactive<{ selectedNetwork: string|undefined }>({
    selectedNetwork: networkSelectOptions.value?.length === 1 ? networkSelectOptions.value[0].code : undefined,
  });

  const selectedNetworkData = computed(() => {
    return networkSelectOptions.value.find(option => option.code === state.selectedNetwork);
  })

  const formatAmountMax = computed(() => {
    return formatBalance(activeAccount.value?.currency, selectedNetworkData.value?.maxAmount ?? props.amountMax);
  })

  const formatAmountMin = computed(() => {
    return formatBalance(activeAccount.value?.currency, selectedNetworkData.value?.minAmount ?? props.amountMin);
  })

  const isSending = ref<boolean>(false);
  const amountValue = ref<string>(String(formatAmountMin.value.amount));

  const withdrawFormData = reactive<{ [key: string]: string }>({});
  props.fields.forEach((field: any) => {
    if (field.key !== 'crypto_network') {
      withdrawFormData[field.key] = field.value ?? undefined;
    }
  });
  const fieldsType:any = fieldsTypeMap;
  const startRules = props.fields.reduce((currentRulesObj, currentField) => {
    if (currentField.key === 'crypto_network') return currentRulesObj;

    const rulesArr: { rule: string, arguments?: string }[] = [];
    if (currentField.isRequired) rulesArr.push({ rule: 'required' });

    if (currentField.key === 'phone') {
      rulesArr.push({ rule: 'phone' });
    } else if (currentField.key === 'cpf_number') {
      rulesArr.push({ rule: 'cpf_number' }); // skeleton cfp_number rule harder
    } else if (currentField.regexp) {
      rulesArr.push({
        rule: 'regex',
        arguments: currentField.regexp
      });
    } else if (currentField.key === 'wallet_id') {
      const findNetworkField = props.fields.find((field) => field.key === 'crypto_network');
      const firstNetworkRegex = findNetworkField ? findNetworkField.options?.[0]?.regex : undefined;

      if (firstNetworkRegex) {
        rulesArr.push({
          rule: 'regex',
          arguments: firstNetworkRegex
        });
      }
    }

    if (rulesArr.length) return { ...currentRulesObj, [currentField.key]: rulesArr };
    return currentRulesObj;
  }, {});

  const withdrawRules = ref<any>(startRules);
  const { getFormRules } = useProjectMethods();
  const withdrawFormRules = computed(() => getFormRules(withdrawRules.value));
  const serverFormErrors = ref<{ [key: string]: Maybe<string> }>({});
  const v$ = useVuelidate(withdrawFormRules, withdrawFormData);

  const getVisibleFields = (): IPaymentField[] => {
    const { public: { showWalletFilledFields } } = useRuntimeConfig();

    props.fields.forEach(field => {
      if (field.value !== null && v$.value[field.key].$invalid) v$.value[field.key].$touch();
    })

    if (showWalletFilledFields) {
      return props.fields;
    }

    return props.fields.filter(field => field.value === null || v$.value[field.key].$invalid);
  }
  const visibleFields = getVisibleFields(); // remove reactivity

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

  const fieldsStore = useFieldsStore();
  const getFieldOptions = (fieldName: string): any => {
    return fieldsStore.selectOptions[fieldName] || [];
  }

  const buttonAmount = computed(() => {
    if (Number(amountValue.value) > formatAmountMax.value.amount) return formatAmountMax.value.amount;
    if (Number(amountValue.value) < formatAmountMin.value.amount) return formatAmountMin.value.amount;
    return amountValue.value;
  });

  const activeAccountWithdrawalFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.withdrawalBalance));
  const fieldHint = computed(() => {
    const minContent = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.withdraw.minSum') || '';
    const maxContent = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.withdraw.maxSum') || '';
    const minAmountContent = `${minContent} ${formatAmountMin.value.amount} ${formatAmountMin.value.currency}`;
    const maxAmountContent = `${maxContent} ${formatAmountMax.value.amount} ${formatAmountMax.value.currency}`;

    return {
      message: `${minAmountContent}, ${maxAmountContent}`,
    };
  });

  const buttonDisabled = computed(() => v$.value.$invalid
    || Number(amountValue.value) > activeAccountWithdrawalFormat.value.amount
    || Number(amountValue.value) < formatAmountMin.value.amount
    || Number(amountValue.value) > formatAmountMax.value.amount
    || isSending.value);

  const onInputNetwork = () => {
    useEvent('analyticsEvent', {
      event: 'walletChangeNetwork',
      walletOperationType: 'withdraw'
    });

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

    amountValue.value = String(formatAmountMin.value.amount);
  };

  const getWithdraw = async (): Promise<void> => {
    if (buttonDisabled.value) return;

    const requestFormData = {
      ...withdrawFormData,
      phone: withdrawFormData.phone ? `+${withdrawFormData.phone}` : undefined
    }

    const networkValue = state.selectedNetwork?.includes('empty-network') ? null : state.selectedNetwork;
    const fields = { ...requestFormData, crypto_network: networkValue }

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
    useEvent('analyticsEvent', {
      event: 'walletSubmitForm',
      walletOperationType: 'withdraw'
    });

    try {
      await withdrawAccount(params);
      closeModal('wallet');
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

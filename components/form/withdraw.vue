<template>
  <iframe v-if="iframeUrl" :src="iframeUrl" />

  <form v-else class="form-withdraw">
    <form-input-dropdown
      v-if="networkSelectOptions?.length"
      v-model:value="state.selectedNetwork"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.label')"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.placeholder')"
      :options="networkSelectOptions"
      class="dropdown-network"
      name="networkSelect"
      @input="onInputNetwork"
    />

    <div
      v-if="networkSelectOptions?.length && !state.selectedNetwork"
      class="dropdown-network__info"
      v-html="infoContent"
    />

    <wallet-warning
      v-if="props.fields?.length && state.selectedNetwork"
      :content="getContent(walletContent, defaultLocaleWalletContent, 'withdraw.warning')"
    />

    <div
      class="form-withdraw__content"
      :class="{ 'is-blured': networkSelectOptions?.length && !state.selectedNetwork }"
    >
      <form-input-number
        v-model:value="amountValue"
        :label="getContent(walletContent, defaultLocaleWalletContent, 'withdraw.sumLabel') || ''"
        name="withdrawSum"
        :min="formatAmountMin.amount"
        :max="formatAmountMax.amount"
        :currency="formatAmountMin.currency"
        :hint="fieldHint"
      />

      <template v-for="field in visibleFields">
        <component
          :is="getFieldComponent(field)"
          v-if="field.key !== 'crypto_network'"
          :key="field.key"
          v-model:value="withdrawFormData[field.key]"
          :type="fieldsType[field.key]?.type || 'text'"
          :label="field.labels[currentLocale?.code || ''] || field.labels.en"
          :name="field.key"
          :placeholder="field.hints[currentLocale?.code || ''] || field.hints.en"
          :options="getFieldOptions(field)"
          :is-required="withdrawFormRules[field.key]?.hasOwnProperty('required')"
          :hint="setError(field.key)"
          @input="fieldInputHandle(field)"
          @blur="v$[field.key]?.$touch()"
          @focus="onFocus(field.key)"
        />
      </template>

      <button-base type="primary" size="md" :is-disabled="buttonDisabled" @click="getWithdraw">
        {{ getContent(walletContent, defaultLocaleWalletContent, 'withdraw.withdrawButton') }} {{ buttonAmount }}
        {{ formatAmountMin.currency }}
      </button-base>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';
  import type { IPaymentField, IWithdrawResponse } from '@skeleton/core/types';
  import { marked } from 'marked';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
  import DOMPurify from 'isomorphic-dompurify';
  import type { IWalletModal } from '~/types';

  const props = defineProps<{
    amountMax: number;
    amountMin: number;
    fields: IPaymentField[];
    method: string;
    processingType: string;
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData, fieldsSettings, defaultLocaleFieldsSettings, currentLocale } =
    storeToRefs(globalStore);

  const walletStore = useWalletStore();
  const { showAlert } = useLayoutStore();
  const { closeModal } = useModalStore();
  const { activeAccount, requestPaymentMethodsRegion } = storeToRefs(walletStore);

  const { formatBalance, getMainBalanceFormat, getContent } = useProjectMethods();

  const networkSelectOptions = computed(() => {
    const networkField = props.fields.find(field => field.key === 'crypto_network');
    const networkOptions = networkField?.options;
    if (networkOptions) {
      return networkOptions?.map(option => ({
        value: option.name,
        minAmount: option.minAmount,
        maxAmount: option.maxAmount,
        code: option.id || `empty-network-${option.name}`,
      }));
    }
    return [];
  });

  const state = reactive<{ selectedNetwork: string | undefined }>({
    selectedNetwork: networkSelectOptions.value?.length === 1 ? networkSelectOptions.value[0].code : undefined,
  });

  const selectedNetworkData = computed(() => {
    return networkSelectOptions.value.find(option => option.code === state.selectedNetwork);
  });

  const formatAmountMax = computed(() => {
    return formatBalance(activeAccount.value?.currency, selectedNetworkData.value?.maxAmount ?? props.amountMax);
  });

  const formatAmountMin = computed(() => {
    return formatBalance(activeAccount.value?.currency, selectedNetworkData.value?.minAmount ?? props.amountMin);
  });

  const isSending = ref<boolean>(false);
  const amountValue = ref<string>(String(formatAmountMin.value.amount));

  const withdrawFormData = reactive<{ [key: string]: string }>({});
  props.fields.forEach((field: any) => {
    if (field.key !== 'crypto_network') {
      withdrawFormData[field.key] = field.value ?? undefined;
    }
  });
  const fieldsType: any = fieldsTypeMap;
  const startRules = props.fields.reduce((currentRulesObj, currentField) => {
    if (currentField.key === 'crypto_network') return currentRulesObj;

    const rulesArr: { rule: string; arguments?: string }[] = [];
    if (currentField.isRequired) rulesArr.push({ rule: 'required' });

    if (currentField.key === 'phone') {
      rulesArr.push({ rule: 'phone' });
    } else if (currentField.key === 'cpf_number') {
      rulesArr.push({ rule: 'cpf_number' }); // skeleton cfp_number rule harder
    } else if (currentField.regexp) {
      rulesArr.push({
        rule: 'regex',
        arguments: currentField.regexp,
      });
    } else if (currentField.key === 'wallet_id') {
      const findNetworkField = props.fields.find(field => field.key === 'crypto_network');
      const firstNetworkRegex = findNetworkField ? findNetworkField.options?.[0]?.regex : undefined;

      if (firstNetworkRegex) {
        rulesArr.push({
          rule: 'regex',
          arguments: firstNetworkRegex,
        });
      }
    }

    if (rulesArr.length) return { ...currentRulesObj, [currentField.key]: rulesArr };
    return currentRulesObj;
  }, {});

  const getFieldComponent = (field: IPaymentField): string => {
    const fieldComponent = fieldsType[field.key]?.component;
    if (fieldComponent) return fieldComponent;
    if (field.fieldType === 'select') return 'form-input-dropdown';
    if (field.fieldType === 'textarea') return 'form-input-textarea';
    if (field.key === 'tag') return 'form-input-withdraw-destination-tag';
    return 'form-input-text';
  };

  const withdrawRules = ref<any>(startRules);
  const { getFormRules } = useProjectMethods();
  const withdrawFormRules = computed(() => getFormRules(withdrawRules.value));
  const serverFormErrors = ref<{ [key: string]: Maybe<string> }>({});
  const v$ = useVuelidate(withdrawFormRules, withdrawFormData);

  const getVisibleFields = (): IPaymentField[] => {
    const {
      public: { showWalletFilledFields },
    } = useRuntimeConfig();

    props.fields.forEach(field => {
      if (field.value !== null && v$.value[field.key]?.$invalid) v$.value[field.key].$touch();
    });

    if (showWalletFilledFields) {
      return props.fields;
    }

    return props.fields.filter(field => field.value === null || v$.value[field.key]?.$invalid);
  };
  const visibleFields = getVisibleFields(); // remove reactivity

  const onFocus = (fieldName: string): void => {
    if (serverFormErrors.value[fieldName]) {
      serverFormErrors.value[fieldName] = undefined;
    }
  };

  const setError = (fieldName: string): undefined | { variant: string; message: any } => {
    if (v$.value[fieldName]?.$error) {
      return {
        variant: 'error',
        message: v$.value[fieldName].$errors[0].$message,
      };
    }
    if (serverFormErrors.value[fieldName]) {
      return {
        variant: 'error',
        message: serverFormErrors.value[fieldName]?.[0],
      };
    }
    return undefined;
  };

  const fieldsStore = useFieldsStore();
  const getFieldOptions = (field: IPaymentField): any => {
    const platformOptions = fieldsStore.selectOptions[field.key];
    if (platformOptions?.length) return platformOptions;
    return (
      field.options?.map(option => {
        return { value: option.name, code: option.id };
      }) || []
    );
  };

  const buttonAmount = computed(() => {
    if (Number(amountValue.value) > formatAmountMax.value.amount) return formatAmountMax.value.amount;
    if (Number(amountValue.value) < formatAmountMin.value.amount) return formatAmountMin.value.amount;
    return amountValue.value;
  });

  const activeAccountWithdrawalFormat = computed(() =>
    formatBalance(activeAccount.value?.currency, activeAccount.value?.withdrawalBalance)
  );
  const fieldHint = computed(() => {
    const minContent = getContent(walletContent, defaultLocaleWalletContent, 'withdraw.minSum') || '';
    const maxContent = getContent(walletContent, defaultLocaleWalletContent, 'withdraw.maxSum') || '';
    const minAmountContent = `${minContent} ${formatAmountMin.value.amount} ${formatAmountMin.value.currency}`;
    const maxAmountContent = `${maxContent} ${formatAmountMax.value.amount} ${formatAmountMax.value.currency}`;

    return {
      message: `${minAmountContent}, ${maxAmountContent}`,
    };
  });

  const buttonDisabled = computed(
    () =>
      v$.value.$invalid ||
      Number(amountValue.value) > activeAccountWithdrawalFormat.value.amount ||
      Number(amountValue.value) < formatAmountMin.value.amount ||
      Number(amountValue.value) > formatAmountMax.value.amount ||
      isSending.value
  );

  const onInputNetwork = () => {
    useEvent('analyticsEvent', {
      event: 'walletChangeNetwork',
      walletOperationType: 'withdraw',
    });

    let networkRegex;

    const findNetworkField = props.fields.find(field => field.key === 'crypto_network');
    if (findNetworkField) {
      const findNetworkOption = findNetworkField?.options?.find(option => {
        if (option.id) return option.id === state.selectedNetwork;
        return state.selectedNetwork === `empty-network-${option.name}`;
      });

      networkRegex = findNetworkOption?.regex;
    }

    withdrawRules.value = {
      ...withdrawRules.value,
      wallet_id: networkRegex
        ? [
            { rule: 'required' },
            {
              rule: 'regex',
              arguments: networkRegex,
            },
          ]
        : [{ rule: 'required' }],
    };

    amountValue.value = String(formatAmountMin.value.amount);
  };

  const infoContent = computed(() => {
    const contentText = getContent(
      fieldsSettings.value,
      defaultLocaleFieldsSettings.value,
      'fieldsControls.networkSelect.info'
    );
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parse(contentText) as string, { FORBID_TAGS: ['style'] });
  });

  const fieldInputHandle = (field: IPaymentField): void => {
    if (field.key === 'currencyWithdraw') {
      const currencyOption = field.options?.find(option => {
        return option.id === withdrawFormData.currencyWithdraw;
      });
      const currencyRegex = currencyOption?.regexp;

      withdrawRules.value = {
        ...withdrawRules.value,
        wallet_id: currencyRegex
          ? [
              { rule: 'required' },
              {
                rule: 'regex',
                arguments: currencyRegex,
              },
            ]
          : [{ rule: 'required' }],
      };
    }

    v$.value[field.key]?.$touch();
  };

  const getPaymentPageUrl = (withdrawResponse: IWithdrawResponse): string => {
    if (!withdrawResponse.action) return '';

    const fieldsKeys = Object.keys(withdrawResponse.fields || {});
    if (!fieldsKeys.length) return withdrawResponse.action;

    const paramsArr = fieldsKeys.map(fieldKey => `${fieldKey}=${withdrawResponse.fields?.[fieldKey]}`);
    const urlHasParams = withdrawResponse.action.includes('?');
    const paramsString = `${urlHasParams ? '&' : '?'}${paramsArr.join('&')}`;

    return `${withdrawResponse.action}${paramsString}`;
  };

  const iframeUrl = ref<string | undefined>();
  const windowReference = ref<Window | null>(null);
  const getWithdraw = async (): Promise<void> => {
    if (buttonDisabled.value) return;

    const requestFormData = {
      ...withdrawFormData,
      phone: withdrawFormData.phone ? `+${withdrawFormData.phone}` : undefined,
    };

    const networkValue = state.selectedNetwork?.includes('empty-network') ? null : state.selectedNetwork;
    const fields = { ...requestFormData, crypto_network: networkValue };

    isSending.value = true;
    const mainCurrencyAmount = getMainBalanceFormat(
      activeAccountWithdrawalFormat.value.currency,
      Number(amountValue.value)
    );
    const params = {
      method: props.method,
      currency: activeAccount.value?.currency || '',
      country: requestPaymentMethodsRegion.value,
      amount: mainCurrencyAmount.amount,
      accountId: activeAccount.value?.id || '',
      fields,
    };

    const { withdrawAccount } = useCoreWalletApi();
    useEvent('analyticsEvent', {
      event: 'walletSubmitForm',
      walletOperationType: 'withdraw',
    });

    if (props.processingType === 'form') {
      windowReference.value = window.open();
    }

    try {
      const response = await withdrawAccount(params);
      const paymentPageUrl = getPaymentPageUrl(response);
      if (props.processingType === 'form' && paymentPageUrl && windowReference.value) {
        windowReference.value.location = paymentPageUrl;
        await closeModal('wallet');
      } else if (props.processingType === 'iframe' && paymentPageUrl) {
        iframeUrl.value = paymentPageUrl;
      } else {
        await closeModal('wallet');
        showAlert(
          alertsData.value?.wallet?.withdrawalProcessed || defaultLocaleAlertsData.value?.wallet?.withdrawalProcessed
        );
      }
    } catch (err: any) {
      if (windowReference.value) windowReference.value.close();

      if (err.response?.status === 422) {
        serverFormErrors.value = err.data?.error?.fields;
      } else {
        showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
      }

      isSending.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/form/withdraw.scss" lang="scss" />

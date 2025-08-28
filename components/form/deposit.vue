<template>
  <iframe v-if="iframeUrl" :src="iframeUrl" />

  <wallet-qr-payment v-else-if="qrAddress" :qr-address="qrAddress" />

  <wallet-await-invoice v-else-if="showAsyncBlock" />

  <form v-else class="form-deposit">
    <form-input-number
      v-model:value="amountValue"
      :hint="fieldHint"
      :label="getContent(walletContent, defaultLocaleWalletContent, 'deposit.sumLabel') || ''"
      name="depositSum"
      :min="formatAmountMin.amount"
      :max="formatAmountMax.amount"
      :currency="formatAmountMin.currency"
      :is-bigger="true"
    />

    <wallet-pills v-if="filteredPresets.length" v-model:value="amountValue" :items="filteredPresets" />

    <component
      :is="getFieldComponent(field)"
      v-for="field in visibleFields"
      :key="field.key"
      v-model:value="depositFormData[field.key]"
      :type="fieldsMap[field.key]?.type || 'text'"
      :label="field.labels[currentLocale?.code || ''] || field.labels.en"
      :name="field.key"
      :placeholder="field.hints[currentLocale?.code || ''] || field.hints.en"
      :options="getFieldOptions(field)"
      :is-required="depositFormRules[field.key]?.hasOwnProperty('required')"
      :hint="setError(field.key)"
      :is-disabled="field.key === 'agentNumber'"
      @input="v$[field.key]?.$touch()"
      @blur="v$[field.key]?.$touch()"
      @focus="onFocus(field.key)"
    />
    
    <atomic-divider />
    <wallet-lotteries :amount="amountValue"/>
    
    <atomic-divider />
    <wallet-bonuses :amount="amountValue" />
    <atomic-divider />

    <div class="form-deposit__button-holder">
      <button-base type="primary" size="md" :is-disabled="buttonDisabled" @click="getDeposit">
        <atomic-spinner :is-shown="isSending" />
        <span class="btn-primary__content">
          <span>
            {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.depositButton') }}
            {{ buttonAmount }}
            {{ formatAmountMin.currency }}
          </span>

          <span v-if="selectedDepositBonus && bonusValue">
            {{ bonusValue }}
          </span>
        </span>
      </button-base>
    </div>
  </form>
</template>

<script setup lang="ts">
  import type {
    IBonus,
    IPaymentField,
    IRequestDeposit,
    IPaymentPreset,
    IResponseDeposit,
    ISocketInvoice,
  } from '@skeleton/api/types';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
  import queryString from 'query-string';
  import type { IWalletModal } from '~/types';
  import { depositAccount } from '@skeleton/api/wallet';
  import { getFormRules } from '@skeleton/helpers/formMethods';
  import { formatBalance, getMainBalanceFormat, getEquivalentFromBase } from '@skeleton/helpers/amountMethods';

  const fieldsMap: Record<string, any> = fieldsTypeMap;

  const props = defineProps<{
    amountMax?: number;
    amountMin?: number;
    method?: string;
    presets?: IPaymentPreset[];
    fields: IPaymentField[];
    processingType: string;
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = globalStore;
  const { currentLocale } = storeToRefs(globalStore);
  const profileStore = useProfileStore();

  const bonusStore = useBonusStore();
  const {
    selectedDepositBonus,
    bonusDeclined,
    showDepositBonusCode,
    depositBonusCode,
    walletDepositBonus,
    depositBonuses,
  } = storeToRefs(bonusStore);
  
  const lotteryStore = useLotteryStore();
  const { lotteryDeclined } = storeToRefs(lotteryStore);

  const getFieldComponent = (field: IPaymentField): string => {
    const fieldComponent = fieldsMap[field.key]?.component;
    if (fieldComponent) return fieldComponent;
    if (field.fieldType === 'select') return 'form-input-dropdown';
    if (field.fieldType === 'textarea') return 'form-input-textarea';
    return 'form-input-text';
  };

  const depositFormData = reactive<{ [key: string]: Maybe<string> }>({});
  props.fields.forEach(field => {
    depositFormData[field.key] = field.value ?? undefined;
  });

  const depositRules = props.fields.reduce((finalRules, currentField) => {
    const rulesArr: { rule: string; arguments?: string }[] = [];
    if (currentField.isRequired) rulesArr.push({ rule: 'required' });

    if (currentField.key === 'phone') {
      rulesArr.push({ rule: 'phone' }); // skeleton phone rule without "+"
    } else if (currentField.key === 'cpf_number') {
      rulesArr.push({ rule: 'cpf_number' }); // skeleton cfp_number rule harder
    } else if (currentField.regexp) {
      rulesArr.push({ rule: 'regex', arguments: currentField.regexp });
    }

    if (rulesArr.length) return { ...finalRules, [currentField.key]: rulesArr };
    return finalRules;
  }, {});
  const depositFormRules = getFormRules(depositRules);
  const { v$, onFocus, setError } = useFormValidation(depositFormRules, depositFormData);

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

    return props.fields.filter(
      field => field.value === null || v$.value[field.key]?.$invalid || field.key === 'agentNumber'
    );
  };
  const visibleFields = getVisibleFields(); // remove reactivity

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

  const walletStore = useWalletStore();
  const layoutStore = useLayoutStore();
  const { showAlert } = layoutStore;
  const { openModal, closeModal } = useModalStore();
  const { activeAccount, requestPaymentMethodsRegion } = storeToRefs(walletStore);

  const formatAmountMax = formatBalance(activeAccount.value?.currency, props.amountMax);
  const formatAmountMin = formatBalance(activeAccount.value?.currency, props.amountMin);
  const minAmountContent = `${getContent(walletContent, defaultLocaleWalletContent, 'deposit.minSum') || ''} ${formatAmountMin.amount} ${formatAmountMin.currency}`;
  const maxAmountContent = `${getContent(walletContent, defaultLocaleWalletContent, 'deposit.maxSum') || ''} ${formatAmountMax.amount} ${formatAmountMax.currency}`;
  const fieldHint = { message: `${minAmountContent}, ${maxAmountContent}` };
  const isSending = ref<boolean>(false);
  const filteredPresets =
    props.presets?.filter(preset => {
      return preset.amount >= formatAmountMin.amount && preset.amount <= formatAmountMax.amount;
    }) || [];
  const defaultPreset = filteredPresets.find(preset => preset.default);
  const walletDepositAmount = computed(() => {
    if (!walletDepositBonus.value || !walletDepositBonus.value.amount) return undefined;
    const findBonus = depositBonuses.value.find(bonus => bonus.id === walletDepositBonus.value?.id);

    if (findBonus) {
      if (defaultPreset?.amount) {
        return walletDepositBonus.value.amount > defaultPreset.amount ? walletDepositBonus.value.amount : undefined;
      }
      return walletDepositBonus.value.amount;
    }

    return undefined;
  });
  const amountValue = ref<string>(String(walletDepositAmount.value || defaultPreset?.amount || formatAmountMin.amount));
  const buttonAmount = computed(() => {
    if (Number(amountValue.value) > formatAmountMax.amount) return formatAmountMax.amount;
    if (Number(amountValue.value) < formatAmountMin.amount) return formatAmountMin.amount;
    return amountValue.value;
  });

  const buttonDisabled = computed(
    () =>
      v$.value.$invalid ||
      Number(amountValue.value) < formatAmountMin.amount ||
      Number(amountValue.value) > formatAmountMax.amount ||
      isSending.value
  );

  const getPaymentPageUrl = (depositResponse: IResponseDeposit): string => {
    if (!depositResponse.action) return '';

    const fieldsKeys = Object.keys(depositResponse.fields || {});
    if (!fieldsKeys.length) return depositResponse.action;

    const paramsArr = fieldsKeys.map(fieldKey => `${fieldKey}=${depositResponse.fields?.[fieldKey]}`);
    const urlHasParams = depositResponse.action.includes('?');
    const paramsString = `${urlHasParams ? '&' : '?'}${paramsArr.join('&')}`;

    return `${depositResponse.action}${paramsString}`;
  };

  const getRequestParams = (): IRequestDeposit => {
    const { query, path } = useRoute();
    const { origin } = window.location;
    const successQueryString = queryString.stringify({ ...query, 'deposit-success': 'true', wallet: undefined });
    const errorQueryString = queryString.stringify({ ...query, 'deposit-error': 'true', wallet: undefined });
    const redirectQueryString = queryString.stringify({ ...query, 'deposit-redirect': 'true', wallet: undefined });
    const successRedirect = `${origin}${path}?${successQueryString}`;
    const errorRedirect = `${origin}${path}?${errorQueryString}`;
    const defaultRedirect = `${origin}${path}?${redirectQueryString}`;

    const mainCurrencyAmount = getMainBalanceFormat(formatAmountMin.currency, Number(amountValue.value));

    return {
      method: props.method || '',
      currency: activeAccount.value?.currency || '',
      country: requestPaymentMethodsRegion.value,
      amount: mainCurrencyAmount.amount,
      accountId: activeAccount.value?.id || '',
      redirectSuccessUrl: successRedirect,
      redirectErrorUrl: errorRedirect,
      redirectUrl: defaultRedirect,
      bonusId: selectedDepositBonus.value?.id,
      isBonusDecline: showDepositBonusCode.value && !depositBonusCode.value ? true : bonusDeclined.value,
      fields: props.fields.length
        ? { ...depositFormData, phone: depositFormData.phone ? `+${depositFormData.phone}` : undefined }
        : undefined,
      lotteryId: lotteryDeclined.value ? undefined : lotteryStore.selectedLotteryId,
    };
  };

  const showAsyncBlock = ref(false);
  const iframeUrl = ref<string | undefined>();
  const qrAddress = ref<string | undefined>();
  const windowReference = ref<Window | null>(null);
  const depositRequest = async (): Promise<void> => {
    isSending.value = true;

    const params = getRequestParams();
    windowReference.value = null;

    if (props.processingType === 'form') {
      windowReference.value = window.open();
    }

    try {
      const depositResponse = await depositAccount(params);
      const paymentPageUrl = getPaymentPageUrl(depositResponse);

      if (props.processingType === 'form' && paymentPageUrl && windowReference.value) {
        windowReference.value.location = paymentPageUrl;
        await closeModal('wallet');
      } else if (props.processingType === 'qr' && depositResponse.qr) {
        qrAddress.value = depositResponse.qr;
      } else if (props.processingType === 'iframe' && paymentPageUrl) {
        iframeUrl.value = paymentPageUrl;
      } else if (props.processingType === 'message') {
        await openModal('deposit-pending');
      } else if (props.processingType === 'asyncRedirect') {
        sessionStorage.setItem('asyncInvoiceId', depositResponse.invoiceId);
        showAsyncBlock.value = true;
      }
    } catch {
      if (windowReference.value) windowReference.value.close();
      await openModal('deposit-error');
    } finally {
      isSending.value = false;
    }
  };

  const getDeposit = async (): Promise<void> => {
    if (buttonDisabled.value) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    if (profileStore.profile?.status === 2) {
      showAlert(alertsData?.limit?.limitedDeposit || defaultLocaleAlertsData?.limit?.limitedDeposit);
      return;
    }

    useEvent('analyticsEvent', {
      event: 'walletSubmitForm',
      walletOperationType: 'deposit',
    });
    await depositRequest();
  };

  const getCahBonusValue = (bonusInfo: IBonus): { amount: number; currency: string } => {
    const amountItems = bonusInfo.assignConditions?.amountItems;
    const amountBase = bonusInfo.assignConditions?.baseCurrencyAmount;
    const exclusionItem = amountItems?.find(item => item.currency === activeAccount.value?.currency);
    if (exclusionItem) return formatBalance(exclusionItem.currency, exclusionItem.amount);
    if (amountBase) return getEquivalentFromBase(amountBase, activeAccount.value?.currency);
    return { amount: 0, currency: activeAccount.value?.currency || '' };
  };

  const getPercentageBonusValue = (bonusInfo: IBonus): { amount: number; currency: string } => {
    const maxAmountItems = bonusInfo.assignConditions?.maxAmountItems;
    const maxAmountBase = bonusInfo.assignConditions?.baseCurrencyMaxAmount;
    const exclusionItem = maxAmountItems?.find(item => item.currency === activeAccount.value?.currency);
    let maxSum: { amount: number; currency: string } = { amount: 0, currency: activeAccount.value?.currency || '' };

    if (exclusionItem) {
      maxSum = formatBalance(exclusionItem.currency, exclusionItem.amount);
    } else if (maxAmountBase) {
      maxSum = getEquivalentFromBase(maxAmountBase, activeAccount.value?.currency);
    }

    const bonusPercentage = bonusInfo.assignConditions?.depositPercentage || 0;
    const percentageSum = (Number(amountValue.value) * bonusPercentage) / 100;

    if (maxSum.amount > percentageSum) return { amount: percentageSum, currency: activeAccount.value?.currency || '' };
    if (maxSum.amount <= percentageSum) return maxSum;
    return { amount: percentageSum, currency: activeAccount.value?.currency || '' };
  };

  const getBonusValue = (bonusInfo: IBonus): { cashBonusAmount: number; freeSpinAmount: number } => {
    let cashBonusAmount: number = 0;
    let freeSpinAmount: number = 0;

    if (bonusInfo.type === 1) {
      const { amount } = getCahBonusValue(bonusInfo);
      if (amount) cashBonusAmount += amount;
    } else if (bonusInfo.type === 2) {
      const { amount } = getPercentageBonusValue(bonusInfo);
      if (amount) cashBonusAmount += amount;
    } else if (bonusInfo?.type === 3) {
      freeSpinAmount += bonusInfo?.assignConditions?.presets?.[0].quantity || 0;
    }

    return { cashBonusAmount, freeSpinAmount };
  };

  const bonusValue = computed(() => {
    if (!selectedDepositBonus.value) return;
    let totalCashBonusAmount = 0;
    let totalFreeSpinAmount = 0;

    if (selectedDepositBonus.value.package?.id) {
      selectedDepositBonus.value.packageItems?.forEach(bonus => {
        const { cashBonusAmount, freeSpinAmount } = getBonusValue(bonus);
        totalCashBonusAmount += cashBonusAmount;
        totalFreeSpinAmount += freeSpinAmount;
      });
    } else {
      const { cashBonusAmount, freeSpinAmount } = getBonusValue(selectedDepositBonus.value);
      totalCashBonusAmount += cashBonusAmount;
      totalFreeSpinAmount += freeSpinAmount;
    }

    let result: string = '';
    if (totalCashBonusAmount) {
      const amountValue = Number(totalCashBonusAmount.toFixed(2));
      result = `${amountValue} ${activeAccount.value?.currency}`;
    }

    if (totalFreeSpinAmount) result += result ? ` + ${totalFreeSpinAmount} FS` : `${totalFreeSpinAmount} FS`;
    return result;
  });

  const checkAsyncInvoice = (invoiceData: ISocketInvoice) => {
    if (showAsyncBlock.value && invoiceData.publicData?.qr) {
      qrAddress.value = invoiceData.publicData.qr;
      showAsyncBlock.value = false;
    }
  };

  onMounted(() => {
    useListen('receivedAsyncInvoice', checkAsyncInvoice);
  });

  onBeforeUnmount(() => {
    useUnlisten('receivedAsyncInvoice', checkAsyncInvoice);
  });
</script>

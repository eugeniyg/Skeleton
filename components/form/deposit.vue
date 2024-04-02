<template>
  <iframe v-if="iframeUrl" :src="iframeUrl" />

  <wallet-qr-payment v-else-if="qrAddress" :qrAddress="qrAddress" />

  <form v-else class="form-deposit">
    <form-input-number
      :hint="fieldHint"
      :label="getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.sumLabel') || ''"
      name="depositSum"
      :min="formatAmountMin.amount"
      :max="formatAmountMax.amount"
      v-model:value="amountValue"
      :currency="formatAmountMin.currency"
      :is-bigger="true"
    />

    <wallet-pills
      v-if="filteredPresets.length"
      v-model:value="amountValue"
      :items="filteredPresets"
    />

    <component
      v-for="field in visibleFields"
      :key="field.key"
      @input="v$[field.key]?.$touch()"
      @blur="v$[field.key]?.$touch()"
      @focus="onFocus(field.key)"
      :is="fieldsMap[field.key]?.component || 'form-input-text'"
      v-model:value="depositFormData[field.key]"
      :type="fieldsMap[field.key]?.type || 'text'"
      :label="field.labels[currentLocale?.code || ''] || field.labels.en"
      :name="field.key"
      :placeholder="field.hints[currentLocale?.code || ''] || field.hints.en"
      :options="getFieldOptions(field.key)"
      :isRequired="depositFormRules[field.key]?.hasOwnProperty('required')"
      :hint="setError(field.key)"
    />

    <template v-if="depositBonuses?.length">
      <atomic-divider />
      <wallet-bonuses :amount="amountValue" />
    </template>

    <atomic-divider />

    <bonus-deposit-code />

    <div class="form-deposit__button-holder">
      <button-base
        type="primary"
        size="md"
        :isDisabled="buttonDisabled"
        @click="getDeposit"
      >
        <atomic-spinner :is-shown="isSending"/>
        <span class="btn-primary__content">
        <span>
          {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.depositButton') }}
          {{ buttonAmount }}
          {{ formatAmountMin.currency }}
        </span>

        <span v-if="selectedDepositBonus && bonusSummary">
          {{ bonusSummary }}
        </span>
      </span>
      </button-base>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type {
    IBonus,
    IPaymentField,
    IRequestDeposit,
    IPaymentPreset,
    IResponseDeposit
  } from '@skeleton/core/types';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
  import queryString from 'query-string';

  const fieldsMap: Record<string, any> = fieldsTypeMap;

  const props = defineProps<{
    amountMax?: number;
    amountMin?: number;
    method?: string;
    presets?: IPaymentPreset[];
    fields: IPaymentField[];
  }>();

  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData
  } = globalStore;
  const { currentLocale } = storeToRefs(globalStore);
  const profileStore = useProfileStore();

  const bonusStore = useBonusStore();
  const { depositBonuses, selectedDepositBonus } = storeToRefs(bonusStore);

  const depositFormData = reactive<{ [key: string]: Maybe<string> }>({});
  props.fields.forEach((field) => {
    depositFormData[field.key] = field.value ?? undefined;
  })

  const { getFormRules, getSumFromAmountItems } = useProjectMethods();
  const depositRules = props.fields.reduce((finalRules, currentField) => {
    const rulesArr: { rule: string, arguments?: string }[] = [];
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

  const fieldsStore = useFieldsStore();
  const getFieldOptions = (fieldName: string): any => {
    return fieldsStore.selectOptions[fieldName] || [];
  }

  const walletStore = useWalletStore();
  const { showModal } = useLayoutStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);

  const { formatBalance, getMainBalanceFormat, getContent } = useProjectMethods();
  const formatAmountMax = formatBalance(activeAccount.value?.currency, props.amountMax);
  const formatAmountMin = formatBalance(activeAccount.value?.currency, props.amountMin);
  const minAmountContent = `${getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.minSum') || ''} ${formatAmountMin.amount} ${formatAmountMin.currency}`;
  const maxAmountContent = `${getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.maxSum') || ''} ${formatAmountMax.amount} ${formatAmountMax.currency}`;
  const fieldHint = { message: `${minAmountContent}, ${maxAmountContent}` };

  const getStorageBonusAmount = (): number|undefined => {
    const storageDepositDataString = sessionStorage.getItem('depositBonusData');
    const storageDepositData = storageDepositDataString ? JSON.parse(storageDepositDataString) : undefined;

    if (storageDepositData && storageDepositData.currency === activeAccount.value?.currency && storageDepositData.amount) {
      return Number(storageDepositData.amount);
    }

    return undefined;
  }

  const isSending = ref<boolean>(false);
  const filteredPresets = props.presets?.filter(preset => {
    return preset.amount >= formatAmountMin.amount && preset.amount <= formatAmountMax.amount;
  }) || [];
  const defaultPreset = filteredPresets.find(preset => preset.default);
  const amountValue = ref<string>(String(getStorageBonusAmount() || defaultPreset?.amount || formatAmountMin.amount));
  const buttonAmount = computed(() => {
    if (Number(amountValue.value) > formatAmountMax.amount) return formatAmountMax.amount;
    if (Number(amountValue.value) < formatAmountMin.amount) return formatAmountMin.amount;
    return amountValue.value;
  });
  const buttonDisabled = computed(() => v$.value.$invalid
    || (Number(amountValue.value) < formatAmountMin.amount)
    || (Number(amountValue.value) > formatAmountMax.amount)
    || isSending.value);
  const processedInModalMethods = ['pix_qr_brl_invoice:pix_qr'];

  const getPaymentPageUrl = (depositResponse: IResponseDeposit): string => {
    const responseHasParams = Object.keys(depositResponse.fields).length;
    if (!responseHasParams) return depositResponse.action;

    const paramsArr = Object.keys(depositResponse.fields).map(fieldKey => `${fieldKey}=${depositResponse.fields[fieldKey]}`);
    const urlHasParams = depositResponse.action.includes('?');
    const paramsString = `${urlHasParams ? '&' : '?'}${paramsArr.join('&')}`;

    return `${depositResponse.action}${paramsString}`;
  }

  const getRequestParams = (): IRequestDeposit => {
    let successRedirect;
    let errorRedirect;

    if (!processedInModalMethods.includes(props.method || '')) {
      const { query, path } = useRoute();
      const { origin } = window.location;
      const successQueryString = queryString.stringify({ ...query, success: 'deposit', wallet: undefined });
      const errorQueryString = queryString.stringify({ ...query, error: 'deposit', wallet: undefined });
      successRedirect = `${origin}${path}?${successQueryString}`;
      errorRedirect = `${origin}${path}?${errorQueryString}`;
    }

    const mainCurrencyAmount = getMainBalanceFormat(formatAmountMin.currency, Number(amountValue.value));

    return {
      method: props.method || '',
      currency: activeAccount.value?.currency || '',
      amount: mainCurrencyAmount.amount,
      accountId: activeAccount.value?.id || '',
      redirectSuccessUrl: successRedirect,
      redirectErrorUrl: errorRedirect,
      bonusId: selectedDepositBonus.value?.id,
      fields: props.fields.length
        ? { ...depositFormData, phone: depositFormData.phone ? `+${depositFormData.phone}` : undefined }
        : undefined
    };
  }

  const iframeUrl = ref<string | undefined>();
  const qrAddress = ref<string | undefined>();
  const windowReference = ref<Window | null>(null);
  const depositRequest = async (): Promise<void> => {
    isSending.value = true;

    const { depositAccount } = useCoreWalletApi();
    const params = getRequestParams();
    windowReference.value = null;

    if (!processedInModalMethods.includes(props.method || '')) {
      windowReference.value = window.open();
    }

    try {
      const depositResponse = await depositAccount(params);
      sessionStorage.removeItem('depositBonusData');
      const paymentPageUrl = getPaymentPageUrl(depositResponse);

      if (windowReference.value && depositResponse.type === 'form') {
        windowReference.value.location = paymentPageUrl;
      } else if (depositResponse.type === 'qr' && depositResponse.qr) {
        qrAddress.value = depositResponse.qr;
      } else if (depositResponse.type === 'iframe') {
        iframeUrl.value = paymentPageUrl;
      }
    } catch {
      if (windowReference.value) windowReference.value.close();
      showModal('error');
    } finally {
      isSending.value = false;
    }
  }

  const getDeposit = async ():Promise<void> => {
    if (buttonDisabled.value) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    if (profileStore.profile?.status === 2) {
      const { showAlert } = useLayoutStore();
      showAlert(alertsData?.limit?.limitedDeposit || defaultLocaleAlertsData?.limit?.limitedDeposit);
      return;
    }

    await depositRequest();
  };

  const getPackageBonusesFreeSpins = (bonusInfo: IBonus): number => {
    if (bonusInfo.packageItems) {
      return bonusInfo.packageItems.reduce((fsCount, currentBonus) => {
        if (currentBonus.type === 3 && currentBonus.assignConditions?.countFreespins) {
          return fsCount + currentBonus.assignConditions?.countFreespins;
        }
        return fsCount;
      }, 0);
    }

    return 0;
  }

  const getCahBonusValue = (bonusInfo: IBonus): string => {
    const amountItems = bonusInfo.assignConditions?.amountItems;
    const mountBase = bonusInfo.assignConditions?.baseCurrencyAmount;
    const bonusSum = getSumFromAmountItems(amountItems, mountBase);
    const packageFreeSpins = getPackageBonusesFreeSpins(bonusInfo);

    return packageFreeSpins
      ? `${getContent(popupsData, defaultLocalePopupsData, 'wallet.buttonBonusLabel')} ${bonusSum} + ${packageFreeSpins} FS`
      : `${getContent(popupsData, defaultLocalePopupsData, 'wallet.buttonBonusLabel')} ${bonusSum}`;
  }

  const getPercentageBonusValue = (bonusInfo: IBonus): string => {
    const maxAmountItems = bonusInfo.assignConditions?.maxAmountItems;
    const maxAmountBase = bonusInfo.assignConditions?.baseCurrencyMaxAmount;
    const maxSum = getSumFromAmountItems(maxAmountItems, maxAmountBase);
    const packageFreeSpins = getPackageBonusesFreeSpins(bonusInfo);

    const bonusPercentage = bonusInfo.assignConditions?.depositPercentage;
    if (!bonusPercentage) return '';

    const percentageSum = Number(amountValue.value) * bonusPercentage / 100;
    let bonusSumString: string = '';

    if (maxSum && parseFloat(maxSum) > percentageSum) {
      bonusSumString = `${percentageSum} ${activeAccount.value?.currency}, ${getContent(popupsData, defaultLocalePopupsData, 'wallet.percentageMax')} ${maxSum}`;
    } else if (maxSum && parseFloat(maxSum) <= percentageSum) {
      bonusSumString = `${maxSum}, ${getContent(popupsData, defaultLocalePopupsData, 'wallet.percentageMax')} ${maxSum}`;
    } else {
      bonusSumString = `${percentageSum} ${activeAccount.value?.currency}`;
    }

    return packageFreeSpins
      ? `${getContent(popupsData, defaultLocalePopupsData, 'wallet.buttonBonusLabel')} ${bonusSumString} + ${packageFreeSpins} FS`
      : `${getContent(popupsData, defaultLocalePopupsData, 'wallet.buttonBonusLabel')} ${bonusSumString}`;
  }

  const bonusSummary = computed(() => {
    if (!selectedDepositBonus.value) return undefined;

    if (selectedDepositBonus.value.type === 1) {
      return getCahBonusValue(selectedDepositBonus.value);
    } else if (selectedDepositBonus.value.type === 2) {
      return getPercentageBonusValue(selectedDepositBonus.value);
    } else if (selectedDepositBonus.value.type === 3) {
      const packageFreeSpins = getPackageBonusesFreeSpins(selectedDepositBonus.value);
      return packageFreeSpins
        ? `${getContent(popupsData, defaultLocalePopupsData, 'wallet.buttonBonusLabel')} ${packageFreeSpins} FS`
        : `${getContent(popupsData, defaultLocalePopupsData, 'wallet.buttonBonusLabel')} ${selectedDepositBonus.value.assignConditions?.countFreespins} FS`;
    }

    return undefined;
  })
</script>

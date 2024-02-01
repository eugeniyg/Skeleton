<template>
  <form class="form-deposit">
    <form-input-number
      :hint="fieldHint"
      :label="getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.sumLabel') || ''"
      name="depositSum"
      :min="formatAmountMin.amount"
      :max="formatAmountMax.amount"
      v-model:value="amountValue"
      :defaultValue="amountDefaultValue"
      :currency="defaultInputSum.currency"
      :is-bigger="true"
    />

    <!--    <wallet-pills />-->
    <component
      v-for="field in props.fields"
      :key="field.key"
      @input="v$[field.key]?.$touch()"
      @blur="v$[field.key]?.$touch()"
      @focus="onFocus(field.key)"
      :is="fieldsTypeMap[field.key]?.component || 'form-input-text'"
      v-model:value="depositFormData[field.key]"
      :type="fieldsTypeMap[field.key]?.type || 'text'"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.key}.label`) || field.labels.en"
      :name="field.key"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.key}.placeholder`) || field.hints.en"
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
            {{ defaultInputSum.currency }}
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
  import type {IBonus, IPaymentField, IResponseDeposit} from '@skeleton/core/types';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
  import queryString from 'query-string';

  const props = defineProps<{
    amountMax?: number,
    amountMin?: number,
    method?: string,
    fields: IPaymentField[]
  }>();

  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
    fieldsSettings,
    defaultLocaleFieldsSettings
  } = useGlobalStore();
  const profileStore = useProfileStore();

  const bonusStore = useBonusStore();
  const { depositBonuses, selectedDepositBonus } = storeToRefs(bonusStore);

  const depositFormData = reactive<{ [key: string]: Maybe<string> }>({});
  props.fields.forEach((field) => {
    depositFormData[field.key] = profileStore.profile?.[field.key];
  })

  const { getFormRules, createValidationRules, getSumFromAmountItems } = useProjectMethods();
  const depositRules = props.fields.reduce((finalRules, currentField) => {
    const rulesArr: { rule: string, arguments?: string }[] = [{ rule: 'required' }];
    if (currentField.key === 'phone') {
      rulesArr.push({ rule: 'phone' }); // skeleton phone rule without "+"
    } else if (currentField.regexp) {
      rulesArr.push({ rule: 'regex', arguments: currentField.regexp });
    }
    return { ...finalRules, [currentField.key]: rulesArr };
  }, {});
  const depositFormRules = getFormRules(depositRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(depositFormRules, depositFormData);

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
  const defaultInputSum = formatBalance(activeAccount.value?.currency, 0.01);
  const amountDefaultValue = ref<number>(activeAccountType.value === 'fiat'
    ? (getStorageBonusAmount() || 20)
    : Number(defaultInputSum.amount));
  const amountValue = ref<number>(amountDefaultValue.value);
  const buttonAmount = computed(() => {
    if (amountValue.value > formatAmountMax.amount) return formatAmountMax.amount;
    if (amountValue.value < formatAmountMin.amount) return formatAmountMin.amount;
    return amountValue.value;
  });
  const buttonDisabled = computed(() => v$.value.$invalid
    || (amountValue.value < formatAmountMin.amount)
    || (amountValue.value > formatAmountMax.amount)
    || isSending.value);

  const getPaymentPageUrl = (depositResponse: IResponseDeposit): string => {
    const responseHasParams = Object.keys(depositResponse.fields).length;
    if (!responseHasParams) return depositResponse.action;

    const paramsArr = Object.keys(depositResponse.fields).map(fieldKey => `${fieldKey}=${depositResponse.fields[fieldKey]}`);
    const urlHasParams = depositResponse.action.includes('?');
    const paramsString = `${urlHasParams ? '&' : '?'}${paramsArr.join('&')}`;

    return `${depositResponse.action}${paramsString}`;
  }

  const getDeposit = async ():Promise<void> => {
    if (buttonDisabled.value) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    if (profileStore.profile?.status === 2 && activeAccountType.value === 'fiat') {
      const { showAlert } = useLayoutStore();
      showAlert(alertsData?.limit?.limitedDeposit || defaultLocaleAlertsData?.limit?.limitedDeposit);
      return;
    }

    isSending.value = true;
    const { query, path } = useRoute();
    const { origin } = window.location;
    const successQueryString = queryString.stringify({ ...query, success: 'deposit', wallet: undefined });
    const errorQueryString = queryString.stringify({ ...query, error: 'deposit', wallet: undefined });
    const successRedirect = `${origin}${path}?${successQueryString}`;
    const errorRedirect = `${origin}${path}?${errorQueryString}`;

    if (depositFormData.phone) {
      depositFormData.phone = `+${depositFormData.phone}`;
    }
    const mainCurrencyAmount = getMainBalanceFormat(defaultInputSum.currency, Number(amountValue.value));
    const params = {
      method: props.method || '',
      currency: activeAccount.value?.currency || '',
      amount: mainCurrencyAmount.amount,
      accountId: activeAccount.value?.id || '',
      redirectSuccessUrl: successRedirect,
      redirectErrorUrl: errorRedirect,
      bonusId: selectedDepositBonus.value?.id,
      fields: props.fields.length ? depositFormData : undefined
    };
    const { depositAccount } = useCoreWalletApi();
    const windowReference:any = window.open();
    try {
      const depositResponse = await depositAccount(params);
      sessionStorage.removeItem('depositBonusData');
      const redirectUrl = getPaymentPageUrl(depositResponse);
      windowReference.location = redirectUrl;
      setTimeout(() => { isSending.value = false; }, 1000);
    } catch {
      windowReference.close();
      isSending.value = false;
      showModal('error');
    }
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

    const percentageSum = amountValue.value * bonusPercentage / 100;
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

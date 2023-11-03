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

    <template v-if="props.fields?.length">
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
    </template>

    <template v-if="depositBonuses?.length">
      <wallet-bonuses :amount="amountValue" />
    </template>

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
          + {{ bonusSummary }}
        </span>
      </span>
      </button-base>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IPaymentField } from '@skeleton/core/types';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';

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
  if (props.fields.length) {
    props.fields.forEach((field) => {
      depositFormData[field.key] = profileStore.profile?.[field.key];
    })
  }

  const { getFormRules, createValidationRules, getSumFromAmountItems } = useProjectMethods();
  const depositRules = createValidationRules(props.fields.map(field => ({ ...field, name: field.key })), true);
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
  const fieldHint = computed(() => ({
    message: `${getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.minSum') || ''} ${formatAmountMin.amount} ${formatAmountMin.currency}`,
  }));

  const isSending = ref<boolean>(false);
  const defaultInputSum = formatBalance(activeAccount.value?.currency, 0.01);
  const amountDefaultValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : Number(defaultInputSum.amount));
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
    const locationQuery = window.location.search;
    const successRedirect = `${window.location.href}${locationQuery ? '&' : '?'}success=deposit`;
    const errorRedirect = `${window.location.href}${locationQuery ? '&' : '?'}error=deposit`;
    const mainCurrencyAmount = getMainBalanceFormat(defaultInputSum.currency, Number(amountValue.value));
    const params = {
      method: props.method || '',
      currency: activeAccount.value?.currency || '',
      amount: mainCurrencyAmount.amount,
      accountId: activeAccount.value?.id || '',
      redirectSuccessUrl: successRedirect,
      redirectErrorUrl: errorRedirect,
      fields: props.fields.length ? depositFormData : undefined
    };
    const { depositAccount } = useCoreWalletApi();
    const windowReference:any = window.open();
    try {
      const depositResponse = await depositAccount(params);
      const redirectUrl = depositResponse?.action;
      windowReference.location = redirectUrl;
      setTimeout(() => { isSending.value = false; }, 1000);
    } catch {
      windowReference.close();
      isSending.value = false;
      showModal('error');
    }
  };

  const bonusSummary = computed(() => {
    if (!selectedDepositBonus.value) return undefined;

    if (selectedDepositBonus.value.type === 1) {
      const amountItems = selectedDepositBonus.value?.assignConditions?.amountItems;
      const mountBase = selectedDepositBonus.value?.assignConditions?.baseCurrencyAmount;
      return getSumFromAmountItems(amountItems, mountBase);
    } else if (selectedDepositBonus.value.type === 2) {
      const maxAmountItems = selectedDepositBonus.value?.assignConditions?.maxAmountItems;
      const maxAmountBase = selectedDepositBonus.value?.assignConditions?.baseCurrencyMaxAmount;
      const maxSum = getSumFromAmountItems(maxAmountItems, maxAmountBase);

      const bonusPercentage = selectedDepositBonus.value?.assignConditions?.depositPercentage;
      if (!bonusPercentage) return undefined;
      const percentageSum = amountValue.value * bonusPercentage / 100;

      if (maxSum && parseFloat(maxSum) > percentageSum) {
        return `${percentageSum} ${activeAccount.value?.currency}, max ${maxSum}`;
      } else if (maxSum && parseFloat(maxSum) <= percentageSum) {
        return `${maxSum}, ${getContent(popupsData, defaultLocalePopupsData, 'wallet.percentageMax')} ${maxSum}`;
      } else {
        return `${percentageSum} ${activeAccount.value?.currency}`;
      }
    } else if (selectedDepositBonus.value.type === 3) {
      return `${selectedDepositBonus.value.assignConditions?.countFreespins} FS`;
    }

    return undefined;
  })
</script>

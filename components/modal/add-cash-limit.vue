<template>
  <vue-final-modal
    class="modal-deposit-limit"
    click-to-close
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('add-cash-limit')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @click="closeModal('add-cash-limit')" />
        <div class="title">
          {{ props.definition ? titleMapping[props.definition] : '' }}
        </div>
      </div>

      <div class="modal-deposit-limit__tabs">
        <button
          v-for="period in periodOptions"
          :key="period.id"
          class="modal-deposit-limit__tabs-item"
          :class="{ 'is-active': period.id === selectedTab.id }"
          :disabled="period.disabled"
          @click="changeTab(period)"
        >
          {{
            getContent(
              globalComponentsContent,
              defaultLocaleGlobalComponentsContent,
              `constants.limitPeriods.${period.id}`
            )
          }}
        </button>
      </div>

      <form-input-currencies
        :key="currencyKey"
        :show-error="formState.showCurrenciesError"
        :items="currenciesOptions"
        :currentLocaleData="props.currentLocaleData"
        :defaultLocaleData="props.defaultLocaleData"
        @select="selectCurrency"
        @blur="blurCurrencySelect"
      />

      <form-input-number
        v-model:value="formState.amount"
        :is-required="false"
        :currency="formattedBalance.currency"
        :min="0"
        :max="1000000"
        label=""
        name="amount"
        placeholder="0"
        :hint="amountError ? setError('amount') : undefined"
        @blur="amountError = false"
        @focus="focusField('amount')"
        @input="focusField('amount')"
      />

      <p class="modal-deposit-limit__description">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'hint') }}
      </p>

      <button-base type="primary" size="md" :is-disabled="isAddButtonDisabled" @click="addLimit">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'addButton') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { ICurrency, IPlayerLimit } from '@skeleton/core/types';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['addCashLimit']>;
    defaultLocaleData: Maybe<IModalsContent['addCashLimit']>;
    definition?: number;
  }>();

  const { closeModal } = useModalStore();
  const limitsStore = useLimitsStore();
  const { getLimits, createLimit } = limitsStore;
  const { limitCashPeriod, activeLimits } = storeToRefs(limitsStore);
  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const {
    currencies,
    alertsData,
    defaultLocaleAlertsData,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
  } = storeToRefs(globalStore);
  const { formatBalance, getMainBalanceFormat, getContent } = useProjectMethods();

  const currencyKey = ref(0);

  const titleMapping = computed<Record<number, string>>(() => ({
    1: getContent(props.currentLocaleData, props.defaultLocaleData, 'addBetLabel'),
    2: getContent(props.currentLocaleData, props.defaultLocaleData, 'addLossLabel'),
    3: getContent(props.currentLocaleData, props.defaultLocaleData, 'addDepositLabel'),
  }));

  const formState = reactive<{
    definition?: number;
    period: string | undefined;
    currency: string;
    amount: string;
    showCurrenciesError: boolean;
  }>({
    definition: props.definition,
    currency: '',
    amount: '0',
    period: undefined,
    showCurrenciesError: false,
  });

  const { getFormRules } = useProjectMethods();
  const limitAmountRules = {};
  const limitAmountFormRules = getFormRules(limitAmountRules);
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(limitAmountFormRules, formState.amount);

  const amountError = ref<boolean>(false);

  const focusField = (fieldName: string): void => {
    amountError.value = false;
    onFocus(fieldName);
  };

  const isPeriodDisabled = (period: { id: string | number; name: string }) => {
    const limits = activeLimits?.value.filter(
      (limit: IPlayerLimit) => limit.definition === formState.definition && limit.period === period.id
    );
    return (
      limits?.length &&
      currencies.value.every(currency =>
        limits?.find(
          (limit: IPlayerLimit) =>
            limit.definition === formState.definition && limit.period === period.id && limit.currency === currency.code
        )
      )
    );
  };

  const periodOptions = computed(() =>
    Object.values(limitCashPeriod.value)?.map(period => {
      if (isPeriodDisabled(period)) {
        return {
          ...period,
          disabled: true,
        };
      }
      return period;
    })
  );

  const isCurrencySelectedInPeriod = (currency: { code: string }) =>
    activeLimits?.value.some(
      (limit: IPlayerLimit) =>
        limit.definition === formState.definition &&
        limit.period === formState.period &&
        limit.currency === currency.code
    );

  const isCurrencySelectedInAllPeriods = (currency: { code: string }) =>
    limitCashPeriod.value?.every(period =>
      activeLimits?.value.some(
        (limit: IPlayerLimit) =>
          limit.definition === formState.definition && limit.period === period.id && limit.currency === currency.code
      )
    );

  const isCurrencyDisabled = (currency: ICurrency): boolean =>
    isCurrencySelectedInPeriod(currency) || isCurrencySelectedInAllPeriods(currency);

  const currenciesOptions = computed(() =>
    currencies.value?.map(currency => {
      if (isCurrencyDisabled(currency)) {
        return { ...currency, disabled: true };
      }
      return currency;
    })
  );

  const selectedPeriod = computed(() => periodOptions.value?.filter(period => !period.disabled)[0]);

  const formattedBalance = computed(() => formatBalance(formState.currency, Number(formState.amount)));

  const selectedTab = ref<{ id: any; name: string }>(selectedPeriod?.value);

  const isAddButtonDisabled = computed(() => !formState.currency);

  const changeTab = (period: { id: string | number; name: string }) => {
    selectedTab.value = period;
    formState.period = period.id as string;
    currencyKey.value += 1;
  };

  const selectCurrency = (currency: ICurrency) => {
    formState.currency = formatBalance(currency.code, 0).currency;
    formState.showCurrenciesError = false;
  };

  const blurCurrencySelect = () => {
    formState.showCurrenciesError = true;
  };

  const addLimit = async () => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      const converted = getMainBalanceFormat(formState.currency, Number(formState.amount));

      await createLimit({
        period: formState.period,
        definition: formState.definition as number,
        amount: converted.amount,
        currency: converted.currency,
      });

      await getLimits();
      await closeModal('add-cash-limit');
      showAlert(alertsData.value?.limit?.cashLimitAdd || defaultLocaleAlertsData.value?.limit?.cashLimitAdd);
    } catch (error: any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
        amountError.value = true;
      }
    }
  };

  onMounted(() => {
    changeTab(selectedTab.value);
  });
</script>

<style src="~/assets/styles/components/modal/add-cash-limit.scss" lang="scss" />

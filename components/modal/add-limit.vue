<template>
  <vue-final-modal
    v-model="modals.addLimit"
    class="modal-deposit-limit"
    @clickOutside="closeModal('addLimit')"
    clickToClose
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @click="closeModal('addLimit')"/>
        <div class="title">{{ titleMapping[props.definition] }}</div>
      </div>

      <div class="modal-deposit-limit__tabs">
        <button
          v-for="period in periodOptions"
          class="modal-deposit-limit__tabs-item"
          :class="{'is-active': period.id === selectedTab.id}"
          :disabled="period.disabled"
          :key="period.id"
          @click="changeTab(period)"
        >
          {{ getContent(limitsContent, defaultLimitsContent, `periodOptions.${ period.id }`) }}
        </button>
      </div>

      <form-input-currencies
        @select="selectCurrency"
        @blur="blurCurrencySelect"
        :show-error="formState.showCurrenciesError"
        :items="currenciesOptions"
      />

      <form-input-number
        :is-required="false"
        :currency="formattedBalance.currency"
        :min="0"
        :defaultValue="0"
        label=""
        name="amount"
        v-model:value="formState.amount"
        placeholder="0"
        :hint="setError('amount')"
        @focus="focusField('amount')"
      />

      <p class="modal-deposit-limit__description">{{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.addCashLimit.hint') }}</p>

      <button-base
        type="primary"
        size="md"
        @click="addLimit"
        :is-disabled="isAddButtonDisabled"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.addCashLimit.addButton') }}
      </button-base>

    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import { CurrencyInterface, PlayerLimitInterface } from '@platform/frontend-core/dist/module';
  import { useGlobalStore } from '~/composables/useGlobalStore';

  const props = defineProps<{ definition?: number }>();

  const limitsStore = useLimitsStore();
  const { getLimits, createLimit, closeModal } = limitsStore;
  const {
    limitCashPeriod, activeLimits, limitsContent, defaultLimitsContent, modals,
  } = storeToRefs(limitsStore);
  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const {
    currencies, alertsData, defaultLocaleAlertsData, popupsData, defaultLocalePopupsData,
  } = storeToRefs(globalStore);
  const {
    formatBalance, getMainBalanceFormat, getContent,
  } = useProjectMethods();

  const titleMapping = computed(() => ({
    1: getContent(popupsData.value, defaultLocalePopupsData.value, 'limitsPopups.addCashLimit.addBetlabel'),
    2: getContent(popupsData.value, defaultLocalePopupsData.value, 'limitsPopups.addCashLimit.addLosslabel'),
    3: getContent(popupsData.value, defaultLocalePopupsData.value, 'limitsPopups.addCashLimit.addDepositlabel'),
  }));

  const formState = reactive<{
    definition?: number;
    period: string|undefined;
    currency: string;
    amount: number;
    showCurrenciesError: boolean
  }>({
    definition: props.definition,
    currency: '',
    amount: 0,
    period: undefined,
    showCurrenciesError: false,
  });

  const { getFormRules } = useProjectMethods();
  const amountRules = {};
  const authorizationFormRules = getFormRules(amountRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(authorizationFormRules, formState.amount);

  const amountError = ref<boolean>(false);

  const focusField = (fieldName:string):void => {
    amountError.value = false;
    onFocus(fieldName);
  };

  const isPeriodDisabled = (period: { id: string|number, name: string }) => {
    const limits = activeLimits?.value.filter((limit: PlayerLimitInterface) => limit.definition === formState.definition
      && limit.period === period.id);
    return (
      limits?.length && currencies.value.every((currency) => limits?.find((limit: PlayerLimitInterface) => (
        limit.definition === formState.definition
        && limit.period === period.id
        && limit.currency === currency.code
      )))
    );
  };

  const periodOptions = computed(() => Object.values(limitCashPeriod.value)?.map((period) => {
    if (isPeriodDisabled(period)) {
      return {
        ...period,
        disabled: true,
      };
    }
    return period;
  }));

  const isCurrencySelectedInPeriod = (currency: {
    code: string
  }) => activeLimits?.value.some((limit: PlayerLimitInterface) => (
    limit.definition === formState.definition
    && limit.period === formState.period
    && limit.currency === currency.code));

  const isCurrencySelectedInAllPeriods = (currency: { code: string }) => limitCashPeriod.value?.every((period: { id: string; name: string }) => activeLimits?.value.some(
    (limit: PlayerLimitInterface) => limit.definition === formState.definition
      && limit.period === period.id
      && limit.currency === currency.code,
  ));

  const isCurrencyDisabled = (currency: CurrencyInterface):boolean => isCurrencySelectedInPeriod(currency) || isCurrencySelectedInAllPeriods(currency);

  const currenciesOptions = computed(() => currencies.value?.map((currency) => {
    if (isCurrencyDisabled(currency)) {
      return { ...currency, disabled: true };
    }
    return currency;
  }));

  const selectedPeriod = computed(() => periodOptions.value?.filter((period) => !period.disabled)[0]);

  const formattedBalance = computed(() => formatBalance(formState.currency, formState.amount));

  const selectedTab = ref<{id:any, name:string}>(selectedPeriod?.value);

  const isAddButtonDisabled = computed(() => !formState.currency);

  const changeTab = (period: { id: string; name: string }) => {
    selectedTab.value = period;
    formState.period = period.id;
  };

  const selectCurrency = (currency: CurrencyInterface) => {
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
      const converted = getMainBalanceFormat(formState.currency, formState.amount);

      await createLimit({
        period: formState.period,
        definition: formState.definition as number,
        amount: converted.amount,
        currency: converted.currency,
      });

      await getLimits();
      closeModal('addLimit');
      showAlert(alertsData.value?.cashLimitAdd || defaultLocaleAlertsData.value?.cashLimitAdd);
    } catch (error: any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      }
    }
  };

  onMounted(() => {
    changeTab(selectedTab.value);
  });
</script>

<style lang="scss">
.modal-deposit-limit {
  @extend %modal-info;

  .vfm__content {
    margin: 0;
  }

  .scroll {
    grid-row-gap: 0;
  }

  .header {
    .title {
      @include upd-font($heading-6);
      margin-bottom: 24px;
      margin-left: 40px;

      @include media(xs) {
        margin-left: 0;
      }
    }

    .btn-modal-close {
      transform: translate(0, 0);
      left: 0;
      --right: auto;
      --top: 0;
      --bg: var(--gray-800);

      .icon {
        &:first-of-type {
          --visibility: visible;
        }

        &:last-of-type {
          --visibility: hidden;
        }

        @include media(xs) {
          &:first-of-type {
            --visibility: hidden;
          }

          &:last-of-type {
            --visibility: visible;
          }
        }
      }

      @include media(xs) {
        --top: #{rem(-4px)};
        --right: #{rem(-14px)};
        --bg: transparent;
        left: auto;
        transform: translateY(-50%);
      }

      @include media(md) {
        --top: #{rem(-6px)};
        --right: #{rem(-14px)};
      }
    }
  }

  &__tabs {
    border-radius: 8px;
    padding: 4px;
    background-color: var(--gray-800);
    display: flex;
    align-items: center;
    grid-gap: 4px;
    margin-bottom: 24px;

    &-item {
      @include font($body-1);
      color: var(--color, var(--gray-300));
      width: 100%;
      text-align: center;
      padding: 4px;
      border-radius: 8px;
      transition: all .2s ease-in-out;
      user-select: none;
      background-color: var(--bg, transparent);
      border: none;

      &.is-active {
        background-color: var(--bg, var(--gray-700));
        --color: var(--white);
      }

      @include use-hover {
        &:not(.is-active):not([disabled]) {
          &:hover {
            cursor: pointer;
            --color: var(--yellow-500);
          }
        }
      }

      &[disabled] {
        --color: var(--gray-600);
        --bg: transparent;
      }
    }
  }

  &__description {
    @include font($body-1);
    color: var(--gray-400);
    margin: 24px 0 0 0;
  }

  .btn-primary {
    margin: 24px 0 0;
  }

  .input-number {
    margin-top: 16px;
  }
}
</style>

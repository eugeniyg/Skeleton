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
          {{ period.name }}
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
        defaultValue=""
        label=""
        name="limit-currency"
        v-model:value="formState.amount"
        placeholder="0"
      />

      <p class="modal-deposit-limit__description">
        The restriction takes effect instantly. You can reduce your limit at any
        time, this change will take effect
        immediately. You can increase the limit, however, in order for this change to take effect, you need 24 hours.
        Cancellation of the deposit limit takes 24 hours. After the limit is exceeded, you will receive an email
        notification.</p>

      <button-base
        type="primary"
        size="md"
        @click="addLimit"
        :is-disabled="isAddButtonDisabled"
      >Add</button-base>

    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import { CreateLimitInterface, CurrencyInterface, StatusInterface } from '@platform/frontend-core/dist/module';

  interface PropsInterface {
    definition: number,
  }

  const props = defineProps<PropsInterface>();

  const emit = defineEmits(['update-limits']);

  const { settingsConstants } = useGlobalStore();
  const layoutStore = useLayoutStore();
  const { closeModal } = layoutStore;
  const { modals } = storeToRefs(layoutStore);
  const limitsStore = useLimitsStore();
  const { activeLimits } = storeToRefs(limitsStore);
  const { createLimit } = limitsStore;
  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const { currencies } = storeToRefs(globalStore);
  const { formatBalance, getMainBalanceFormat } = useProjectMethods();

  const limitsCashPeriod = ref<StatusInterface[]>(settingsConstants?.player.limit.cashPeriod || []);

  const titleMapping = {
    1: 'New wagger limit',
    2: 'New loss limit',
    3: 'New deposit limit',
  };

  const formState = reactive<CreateLimitInterface>({
    definition: props.definition,
    currency: '',
    amount: 0,
    period: undefined,
    showCurrenciesError: false,
  });

  const isPeriodDisabled = (period: { id: string|number }) => {
    const limits = activeLimits?.value.filter((limit) => limit.definition === formState.definition
      && limit.period === period.id);
    return (
      limits?.length && currencies.value.every((currency) => limits?.find((limit) => (
        limit.definition === formState.definition
        && limit.period === period.id
        && limit.currency === (!formState.currency ? currency.code : formState.currency))))
    );
  };

  const periodOptions = computed(() => Object.values(limitsCashPeriod.value)?.map((period) => {
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
  }) => activeLimits?.value.some((limit) => (
    limit.definition === formState.definition
    && limit.period === formState.period
    && limit.currency === currency.code));

  const isCurrencySelectedInAllPeriods = (currency: { code: string }) => limitsCashPeriod.value?.every((period) => activeLimits?.value.some(
    (limit) => limit.definition === formState.definition
      && limit.period === period.id
      && limit.currency === currency.code,
  ));

  const isCurrencyDisabled = (currency: {
    code: string
  }) => isCurrencySelectedInPeriod(currency) || isCurrencySelectedInAllPeriods(currency);

  const currenciesOptions = computed(() => currencies.value?.map((currency) => {
    if (isCurrencyDisabled(currency)) {
      return { ...currency, disabled: true };
    }
    return currency;
  }));

  const selectedPeriod = computed(() => periodOptions.value?.filter((period) => !period.disabled)[0]);

  const formattedBalance = computed(() => formatBalance(formState.currency, formState.amount));

  const selectedTab = ref<StatusInterface>(selectedPeriod?.value);

  const isAddButtonDisabled = computed(() => !formState.currency && !formState.period);

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
    try {
      const converted = getMainBalanceFormat(formState.currency, formState.amount);

      await createLimit({
        period: formState.period,
        definition: formState.definition,
        amount: converted.amount,
        currency: converted.currency,
      });

      emit('update-limits');
    } catch (error: any) {
      if (error.response?.status === 422) {
        showAlert({
          title: error.data?.error?.message,
          type: 'error',
        });
      } else {
        showAlert({
          title: 'Something went wrong',
          type: 'error',
        });
      }
    } finally {
      closeModal('addLimit');
    }
  };

  onMounted(() => {
    formState.period = selectedPeriod.value.id;
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
        &:not(.is-active) {
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

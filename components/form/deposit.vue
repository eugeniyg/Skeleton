<template>
  <form class="form-deposit">
    <form-input-number
      :hint="fieldHint"
      :label="getContent(popupsData, defaultLocalePopupsData, 'deposit.sumLabel') || ''"
      name="depositSum"
      :min="formatAmountMin.amount"
      :max="formatAmountMax.amount"
      v-model:value="amountValue"
      :defaultValue="amountDefaultValue"
      :currency="defaultInputSum.currency"
      :is-bigger="true"
    />

    <template v-if="getContent(popupsData, defaultLocalePopupsData, 'deposit.bonuses')?.length">
      <atomic-divider/>
      <template v-for="(bonus, index) in getContent(popupsData, defaultLocalePopupsData, 'deposit.bonuses')" :key="index">
        <atomic-bonus v-bind="bonus" />
        <atomic-divider />
      </template>
    </template>

    <form-input-toggle
      name="bonus-toggle"
      v-model:value="hasBonusCode"
      @change="hasBonusCode = !hasBonusCode"
    >
      {{ getContent(popupsData, defaultLocalePopupsData, 'deposit.togglerLabel') || '' }}
    </form-input-toggle>

    <form-bonus-code
      v-if="hasBonusCode"
      v-model:value="bonusValue"
    />

    <button-base
      type="primary"
      size="md"
      :isDisabled="buttonDisabled"
      @click="getDeposit"
    >
      <atomic-spinner :is-shown="isSending"/>
      {{ getContent(popupsData, defaultLocalePopupsData, 'deposit.depositButton') }} {{ buttonAmount }} {{ defaultInputSum.currency }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    amountMax?: number,
    amountMin?: number,
    method?: string
  }>();

  const {
    popupsData, defaultLocalePopupsData, alertsData, defaultLocaleAlertsData,
  } = useGlobalStore();

  const walletStore = useWalletStore();
  const { showModal } = useLayoutStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);

  const { formatBalance, getMainBalanceFormat, getContent } = useProjectMethods();
  const formatAmountMax = formatBalance(activeAccount.value?.currency, props.amountMax);
  const formatAmountMin = formatBalance(activeAccount.value?.currency, props.amountMin);
  const fieldHint = computed(() => ({
    message: `${getContent(popupsData, defaultLocalePopupsData, 'deposit.minSum') || ''} ${formatAmountMin.amount} ${formatAmountMin.currency}`,
  }));

  const isSending = ref<boolean>(false);
  const defaultInputSum = formatBalance(activeAccount.value?.currency, 0.01);
  const amountDefaultValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : Number(defaultInputSum.amount));
  const amountValue = ref<number>(amountDefaultValue.value);
  const hasBonusCode = ref<boolean>(false);
  const bonusValue = ref<string>('');
  const buttonAmount = computed(() => {
    if (amountValue.value > formatAmountMax.amount) return formatAmountMax.amount;
    if (amountValue.value < formatAmountMin.amount) return formatAmountMin.amount;
    return amountValue.value;
  });
  const buttonDisabled = computed(() => amountValue.value < formatAmountMin.amount
    || amountValue.value > formatAmountMax.amount || isSending.value);

  const getDeposit = async ():Promise<void> => {
    if (buttonDisabled.value) return;

    const profileStore = useProfileStore();
    if (profileStore.profile?.status === 2 && activeAccountType.value === 'fiat') {
      const { showAlert } = useLayoutStore();
      showAlert(alertsData?.limitedDeposit || defaultLocaleAlertsData?.limitedDeposit);
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
</script>

<style lang="scss">
.form-deposit {
  .input-toggle {
    width: 100%;
    --slider-bg: var(--black-primary);
  }
}
</style>

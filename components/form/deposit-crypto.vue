<template>
  <form class="form-deposit-crypto">
    <form-input-dropdown
      v-if="props.fields?.length"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.label')"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.placeholder')"
      v-model:value="state.selectedNetwork"
      :options="networkSelectOptions"
      class="dropdown-network"
      name="networkSelect"
      @input="onInputNetwork"
    />

    <div class="dropdown-network__info"
         v-if="props.fields?.length && !state.selectedNetwork"
         v-html="marked.parse(getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.info'))"
    />

    <div class="form-deposit-crypto__content" :class="{'is-blured': props.fields?.length && !state.selectedNetwork }">

      <atomic-qr
        :content="popupsData?.wallet?.deposit || defaultLocalePopupsData?.wallet?.deposit"
        :qrAddress="walletNumber"
      />

      <form-input-copy
        name="walletNumber"
        :label="getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.addressInputLabel') || ''"
        :hint="fieldHint"
        :value="walletNumber"
      />

      <template v-if="depositBonuses?.length">
        <atomic-divider />
        <wallet-bonuses crypto />
      </template>

      <atomic-divider />
      <bonus-deposit-code/>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import type { IPaymentField, IRequestDeposit, IBonus, IPaymentFieldOption } from '@skeleton/core/types';
  import debounce from 'lodash/debounce';

  const props = defineProps<{
    amountMax?: number,
    amountMin?: number,
    method?: string,
    fields?: IPaymentField[],
  }>();

  const walletNumber = ref<string>('');
  const walletStore = useWalletStore();
  const { showModal } = useLayoutStore();
  const { activeAccount } = storeToRefs(walletStore);

  const bonusStore = useBonusStore();
  const { depositBonuses, selectedDepositBonus } = storeToRefs(bonusStore);

  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
    fieldsSettings,
    defaultLocaleFieldsSettings,
  } = useGlobalStore();

  const {
    formatBalance,
    getContent
  } = useProjectMethods();

  const networkSelectOptions = computed(() => {
    const select = props.fields && props.fields.find((item) => item.fieldType === 'select');
    if (select?.options) {
      return select?.options.map((option: IPaymentFieldOption) => ({
        value: option.name,
        minAmount: option.minAmount,
        maxAmount: option.maxAmount,
        code: option.id || `empty-network-${option.name}`,
      }));
    }
    return [];
  });

  const fieldHint = computed(() => {
    const selectedNetworkData = networkSelectOptions.value.find(option => option.code === state.selectedNetwork);

    const minSumFormat = formatBalance(activeAccount.value?.currency, selectedNetworkData?.minAmount ?? props.amountMin);
    const maxSumFormat = formatBalance(activeAccount.value?.currency, selectedNetworkData?.maxAmount ?? props.amountMax);

    const minContent = `${getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.minSum') || ''} ${minSumFormat.amount} ${minSumFormat.currency}`;
    const maxContent = `${getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.maxSum') || ''} ${maxSumFormat.amount} ${maxSumFormat.currency}`;

    return {
      message: `${minContent}, ${maxContent}`,
    };
  });

  const state = reactive<{
    selectedNetwork: string|undefined,
    params: IRequestDeposit
  }>({
    selectedNetwork: networkSelectOptions.value?.length === 1 ? networkSelectOptions.value[0].code : undefined,
    params: {
      method: props.method || '',
      currency: activeAccount.value?.currency || '',
      amount: props.amountMin || 0,
      accountId: activeAccount.value?.id || '',
      redirectSuccessUrl: window.location.href,
      redirectErrorUrl: window.location.href,
      fields: undefined,
      bonusId: selectedDepositBonus.value?.id
    },
  });

  const { depositAccount } = useCoreWalletApi();
  const sendDepositData = async ():Promise<void> => {
    state.params.bonusId = selectedDepositBonus.value?.id;

    try {
      const depositResponse = await depositAccount(state.params);
      walletNumber.value = depositResponse.address;
    } catch {
      showModal('error');
    }
  }

  const onInputNetwork = async ():Promise<void> => {
    const networkValue = state.selectedNetwork?.includes('empty-network') ? null : state.selectedNetwork;
    state.params.fields = { crypto_network: networkValue }
    await sendDepositData();
  }

  const debounceDeposit = debounce(async (newBonusValue: IBonus|undefined): Promise<void> => {
    if (newBonusValue?.id === state.params.bonusId) return;
    await sendDepositData();
  }, 1000, { leading: false });

  watch(() => selectedDepositBonus.value, (newValue: IBonus|undefined) => {
    debounceDeposit(newValue);
  });

  onMounted(async () => {
    if (networkSelectOptions.value?.length) {
      const networkValue = networkSelectOptions.value[0].code.includes('empty-network') ? null : networkSelectOptions.value[0].code;
      state.params.fields = { crypto_network: networkValue };
      await sendDepositData();
    }
  })
</script>

<style src="~/assets/styles/components/form/deposit-crypto.scss" lang="scss"/>

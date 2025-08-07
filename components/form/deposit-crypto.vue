<template>
  <form class="form-deposit-crypto">
    <form-input-dropdown
      v-if="props.fields?.length"
      v-model:value="state.selectedNetwork"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.label')"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.placeholder')"
      :options="networkSelectOptions"
      class="dropdown-network"
      name="networkSelect"
      @input="onInputNetwork"
    />

    <div v-if="props.fields?.length && !state.selectedNetwork" class="dropdown-network__info" v-html="infoContent" />

    <wallet-warning
      v-if="props.fields?.length && state.selectedNetwork"
      :content="getContent(walletContent, defaultLocaleWalletContent, 'deposit.warning')"
    />

    <div class="form-deposit-crypto__content" :class="{ 'is-blured': props.fields?.length && !state.selectedNetwork }">
      <wallet-destination-tag v-if="destinationTag" :value="destinationTag" />

      <wallet-crypto-qr
        :content="getContent(walletContent, defaultLocaleWalletContent, 'deposit')"
        :qr-address="walletNumber"
      />

      <form-input-copy
        name="walletNumber"
        :label="getContent(walletContent, defaultLocaleWalletContent, 'deposit.addressInputLabel') || ''"
        :hint="fieldHint"
        :value="walletNumber"
        :copy-tooltip="getContent(walletContent, defaultLocaleWalletContent, 'deposit.copiedLabel')"
      />
      
      <atomic-divider />
      <wallet-lotteries :amount="amountValue"/>
      
      <pre>{{ props.amountMax }}</pre>

      <atomic-divider />
      <wallet-bonuses crypto />
    </div>
  </form>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import type { IPaymentField, IRequestDeposit, IBonus } from '@skeleton/api/types';
  import debounce from 'lodash/debounce';
  import DOMPurify from 'isomorphic-dompurify';
  import type { IWalletModal } from '~/types';
  import { depositAccount } from '@skeleton/api/wallet';
  import { formatBalance } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    amountMax?: number;
    amountMin?: number;
    method?: string;
    fields?: IPaymentField[];
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const walletNumber = ref<string>('');
  const destinationTag = ref<string | undefined>();
  const walletStore = useWalletStore();
  const { openModal } = useModalStore();
  const { activeAccount, requestPaymentMethodsRegion } = storeToRefs(walletStore);

  const bonusStore = useBonusStore();
  const { selectedDepositBonus, bonusDeclined, showDepositBonusCode, depositBonusCode } = storeToRefs(bonusStore);

  const { fieldsSettings, defaultLocaleFieldsSettings } = useGlobalStore();

  const networkSelectOptions = computed(() => {
    const networkField = props.fields && props.fields.find(field => field.key === 'crypto_network');
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

  const fieldHint = computed(() => {
    const selectedNetworkData = networkSelectOptions.value.find(option => option.code === state.selectedNetwork);

    const minSumFormat = formatBalance(
      activeAccount.value?.currency,
      selectedNetworkData?.minAmount ?? props.amountMin
    );
    const maxSumFormat = formatBalance(
      activeAccount.value?.currency,
      selectedNetworkData?.maxAmount ?? props.amountMax
    );

    const minContent = `${getContent(walletContent, defaultLocaleWalletContent, 'deposit.minSum') || ''} ${minSumFormat.amount} ${minSumFormat.currency}`;
    const maxContent = `${getContent(walletContent, defaultLocaleWalletContent, 'deposit.maxSum') || ''} ${maxSumFormat.amount} ${maxSumFormat.currency}`;

    return {
      message: `${minContent}, ${maxContent}`,
    };
  });

  const state = reactive<{
    selectedNetwork: string | undefined;
    params: IRequestDeposit;
  }>({
    selectedNetwork: networkSelectOptions.value?.length === 1 ? networkSelectOptions.value[0].code : undefined,
    params: {
      method: props.method || '',
      currency: activeAccount.value?.currency || '',
      country: requestPaymentMethodsRegion.value,
      amount: props.amountMin || 0,
      accountId: activeAccount.value?.id || '',
      redirectSuccessUrl: window.location.href,
      redirectErrorUrl: window.location.href,
      fields: undefined,
      bonusId: selectedDepositBonus.value?.id,
      isBonusDecline: bonusDeclined.value,
    },
  });

  const sendDepositData = async (): Promise<void> => {
    state.params.bonusId = selectedDepositBonus.value?.id;
    state.params.isBonusDecline = showDepositBonusCode.value && !depositBonusCode.value ? true : bonusDeclined.value;
    state.params.country = requestPaymentMethodsRegion.value;

    try {
      const depositResponse = await depositAccount(state.params);
      walletNumber.value = depositResponse.address;
      destinationTag.value = depositResponse.tag;
    } catch {
      await openModal('deposit-error');
    }
  };

  const onInputNetwork = async (): Promise<void> => {
    useEvent('analyticsEvent', {
      event: 'walletChangeNetwork',
      walletOperationType: 'deposit',
    });

    const networkValue = state.selectedNetwork?.includes('empty-network') ? null : state.selectedNetwork;
    if (state.params.fields?.crypto_network === networkValue) return;

    state.params.fields = { crypto_network: networkValue };
    await sendDepositData();
  };

  const debounceDeposit = debounce(
    async (newBonusValue: IBonus | undefined): Promise<void> => {
      if (
        newBonusValue?.id === state.params.bonusId &&
        bonusDeclined.value === state.params.isBonusDecline &&
        !showDepositBonusCode.value
      )
        return;
      await sendDepositData();
    },
    1000,
    { leading: false }
  );

  const infoContent = computed(() => {
    const contentText = getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.networkSelect.info');
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parse(contentText) as string, { FORBID_TAGS: ['style'] });
  });

  watch(selectedDepositBonus, (newValue: IBonus | undefined) => {
    debounceDeposit(newValue);
  });

  watch(bonusDeclined, newValue => {
    if (newValue) debounceDeposit(undefined);
  });

  watch(showDepositBonusCode, newValue => {
    if (newValue) debounceDeposit(undefined);
  });

  watch(depositBonusCode, newValue => {
    if (newValue) debounceDeposit(undefined);
  });

  onMounted(async () => {
    if (networkSelectOptions.value?.length) {
      const networkValue = networkSelectOptions.value[0].code.includes('empty-network')
        ? null
        : networkSelectOptions.value[0].code;
      state.params.fields = { crypto_network: networkValue };
      await sendDepositData();
    }
  });
</script>

<style src="~/assets/styles/components/form/deposit-crypto.scss" lang="scss" />

<template>
  <form class="form-deposit-crypto">
    <form-input-dropdown
      v-if="props.fields?.length"
      :label="getContent(fieldsContent, defaultLocaleFieldsContent, 'networkSelect.label')"
      :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, 'networkSelect.placeholder')"
      v-model:value="state.selectedNetwork"
      :options="networkSelectOptions"
      class="dropdown-network"
      name="networkSelect"
      @input="onInputNetwork"
    />

    <div class="dropdown-network__info"
         v-if="props.fields?.length && !state.selectedNetwork"
         v-html="marked.parse(getContent(fieldsContent, defaultLocaleFieldsContent, 'networkSelect.info'))"
    />

    <div class="form-deposit-crypto__content" :class="{'is-blured': props.fields?.length && !state.selectedNetwork }">

      <atomic-qr :content="popupsData?.deposit || defaultLocalePopupsData?.deposit" :qrLink="qrLink"/>

      <form-input-copy
        name="walletNumber"
        :label="getContent(popupsData, defaultLocalePopupsData, 'deposit.addressInputLabel') || ''"
        :hint="fieldHint"
        :value="walletNumber"
      />

      <template v-if="bonusesList?.length">
        <atomic-divider/>

        <template
          v-for="(bonus, index) in bonusesList"
          :key="index"
        >
          <atomic-bonus v-bind="bonus"/>
          <atomic-divider/>
        </template>
      </template>

      <bonus-deposit-code/>
    </div>

  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { PaymentFieldInterface, RequestDepositInterface } from '@platform/frontend-core';

  const props = defineProps<{
    amountMax?: number,
    amountMin?: number,
    method?: string,
    fields?: PaymentFieldInterface[],
  }>();

  const walletNumber = ref<string>('');
  const qrLink = ref<string>('');

  const walletStore = useWalletStore();
  const { showModal } = useLayoutStore();
  const {
    activeAccount,
    activeAccountType
  } = storeToRefs(walletStore);

  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
    fieldsContent,
    defaultLocaleFieldsContent,
  } = useGlobalStore();

  const {
    formatBalance,
    getContent
  } = useProjectMethods();
  const fieldHint = computed(() => {
    const formatSum = formatBalance(activeAccount.value?.currency, props.amountMin);
    return {
      message: `${getContent(popupsData, defaultLocalePopupsData, 'deposit.minSum') || ''} ${formatSum.amount} ${formatSum.currency}`,
    };
  });

  const bonusesList = computed(() => {
    if (popupsData?.deposit?.bonuses?.length) return popupsData?.deposit.bonuses;
    return defaultLocalePopupsData?.deposit?.bonuses || [];
  });

  const networkSelectOptions = computed(() => {
    const select = props.fields && props.fields.find((item) => item.fieldType === 'select');
    if (select?.options) {
      return select?.options.map((option) => ({
        value: option.name,
        code: String(option.id),
      }));
    }
    return [];
  });

  const state = reactive<{
    selectedNetwork: string,
    params: RequestDepositInterface
  }>({
    selectedNetwork: '',
    params: {
      method: props.method || '',
      currency: activeAccount.value?.currency || '',
      amount: props.amountMin || 0,
      accountId: activeAccount.value?.id || '',
      redirectSuccessUrl: window.location.href,
      redirectErrorUrl: window.location.href,
    },
  });

  const onInputNetwork = async () => {
    const { depositAccount } = useCoreWalletApi();

    if (state.selectedNetwork && state.selectedNetwork !== 'null') {
      state.params = {
        ...state.params,
        fields: { crypto_network: state.selectedNetwork }
      };
    } else {
      state.params.fields = undefined;
    }

    try {
      const depositResponse = await depositAccount(state.params);
      walletNumber.value = depositResponse.address;
      qrLink.value = depositResponse.qrAddress;
    } catch {
      showModal('error');
    }
  };

  onMounted(async () => {
    const profileStore = useProfileStore();
    if (profileStore.profile?.status === 2 && activeAccountType.value === 'fiat') {
      const { showAlert } = useLayoutStore();
      showAlert(alertsData?.limitedDeposit || defaultLocaleAlertsData?.limitedDeposit);
      return;
    }

    const { depositAccount } = useCoreWalletApi();
    try {
      const depositResponse = await depositAccount({
        ...state.params,
        fields: networkSelectOptions.value?.length ? { crypto_network: networkSelectOptions.value[0].code } : undefined
      });

      walletNumber.value = depositResponse.address;
      qrLink.value = depositResponse.qrAddress;
    } catch {
      showModal('error');
    }
  });
</script>

<style src="~/assets/styles/components/form/deposit-crypto.scss" lang="scss"/>

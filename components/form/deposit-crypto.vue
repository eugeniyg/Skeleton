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

      <atomic-qr :content="popupsData?.deposit || defaultLocalePopupsData?.deposit" :qrLink="qrLink"/>

      <form-input-copy
        name="walletNumber"
        :label="getContent(popupsData, defaultLocalePopupsData, 'deposit.addressInputLabel') || ''"
        :hint="fieldHint"
        :value="walletNumber"
      />

      <template v-if="bonusesList?.length">
        <!--      <template v-for="(bonus, index) in bonusesList" :key="index">-->
        <!--        <atomic-bonus v-bind="bonus" />-->
        <!--      </template>-->

        <wallet-bonuses crypto />
      </template>

      <bonus-deposit-code/>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { IPaymentField, IRequestDeposit } from '@skeleton/core/types';

  const props = defineProps<{
    amountMax?: number,
    amountMin?: number,
    method?: string,
    fields?: IPaymentField[],
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
    fieldsSettings,
    defaultLocaleFieldsSettings,
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
    return popupsData?.deposit?.bonuses || [];
  });

  const networkSelectOptions = computed(() => {
    const select = props.fields && props.fields.find((item) => item.fieldType === 'select');
    if (select?.options) {
      return select?.options.map((option: { id: string|null, name: string }) => ({
        value: option.name,
        code: option.id || `empty-network-${option.name}`,
      }));
    }
    return [];
  });

  const state = reactive<{
    selectedNetwork: string,
    params: IRequestDeposit
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

    if (state.selectedNetwork && !state.selectedNetwork.includes('empty-network')) {
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
    const { depositAccount } = useCoreWalletApi();
    try {
      const fieldsOptions =  networkSelectOptions.value?.length && !networkSelectOptions.value[0].code.includes('empty-network');
      const depositResponse = await depositAccount({
        ...state.params,
        fields: fieldsOptions ? { crypto_network: networkSelectOptions.value[0].code } : undefined
      });

      walletNumber.value = depositResponse.address;
      qrLink.value = depositResponse.qrAddress;
    } catch {
      showModal('error');
    }
  });
</script>

<style src="~/assets/styles/components/form/deposit-crypto.scss" lang="scss"/>

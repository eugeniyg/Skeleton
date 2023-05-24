<template>
  <form class="form-deposit-crypto">
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

    <bonus-deposit-code />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    amountMax?: number,
    amountMin?: number,
    method?: string
  }>();

  const walletNumber = ref<string>('');
  const qrLink = ref<string>('');

  const walletStore = useWalletStore();
  const { showModal } = useLayoutStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);

  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
  } = useGlobalStore();

  const { formatBalance, getContent } = useProjectMethods();
  const fieldHint = computed(() => {
    const formatSum = formatBalance(activeAccount.value?.currency, props.amountMin);
    return {
      message: `${getContent(popupsData, defaultLocalePopupsData, 'deposit.minSum') || ''} ${formatSum.amount} ${formatSum.currency}`,
    };
  });

  const bonusesList = computed(() => {
    if (popupsData?.deposit?.bonuses?.length) return popupsData.deposit.bonuses;
    return defaultLocalePopupsData?.deposit?.bonuses || [];
  });

  onMounted(async () => {
    const profileStore = useProfileStore();
    if (profileStore.profile?.status === 2 && activeAccountType.value === 'fiat') {
      const { showAlert } = useLayoutStore();
      showAlert(alertsData?.limitedDeposit || defaultLocaleAlertsData?.limitedDeposit);
      return;
    }

    const params = {
      method: props.method || '',
      currency: activeAccount.value?.currency || '',
      amount: props.amountMin || 0,
      accountId: activeAccount.value?.id || '',
      redirectSuccessUrl: window.location.href,
      redirectErrorUrl: window.location.href,
    };

    const { depositAccount } = useCoreWalletApi();
    try {
      const depositResponse = await depositAccount(params);
      walletNumber.value = depositResponse.address;
      qrLink.value = depositResponse.qrAddress;
    } catch {
      showModal('error');
    }
  });
</script>

<style lang="scss">
.form-deposit-crypto {
  .row {
    display: flex;
    min-height: rem(44px);
  }
}
</style>

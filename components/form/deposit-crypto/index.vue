<template>
  <form class="form-deposit-crypto">
    <atomic-qr :content="depositContent" :qrLink="qrLink"/>

    <form-input-copy
      name="walletNumber"
      :label="depositContent?.addressInputLabel || ''"
      :hint="fieldHint"
      :value="walletNumber"
    />

    <template v-if="depositContent?.bonuses?.length">
      <atomic-divider/>

      <template v-for="(bonus, index) in depositContent?.bonuses" :key="index">
        <atomic-bonus v-bind="bonus"/>
        <atomic-divider/>
      </template>
    </template>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { DepositInterface } from '~/types';

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

  const { popupsData, alertsData } = useGlobalStore();

  const depositContent: DepositInterface | undefined = popupsData?.deposit;

  const { formatBalance } = useProjectMethods();
  const fieldHint = computed(() => {
    const formatSum = formatBalance(activeAccount.value.currency, props.amountMin);
    return {
      message: `${depositContent?.minSum || ''} ${formatSum.amount} ${formatSum.currency}`,
    };
  });

  onMounted(async () => {
    const profileStore = useProfileStore();
    if (profileStore.playerStatusName === 'Limited' && activeAccountType.value === 'fiat') {
      const { showAlert } = useLayoutStore();
      showAlert(alertsData?.limitedDeposit);
      return;
    }

    const params = {
      method: props.method,
      currency: activeAccount.value.currency,
      amount: props.amountMin,
      accountId: activeAccount.value.id,
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

<style lang="scss" src="./style.scss"/>

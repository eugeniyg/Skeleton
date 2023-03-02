<template>
  <form class="form-deposit-crypto">
    <atomic-qr :content="depositContent || defaultLocaleDepositContent" :qrLink="qrLink"/>

    <form-input-copy
      name="walletNumber"
      :label="getContent(depositContent, defaultLocaleDepositContent, 'addressInputLabel') || ''"
      :hint="fieldHint"
      :value="walletNumber"
    />

    <template v-if="getContent(depositContent, defaultLocaleDepositContent, 'bonuses')?.length">
      <atomic-divider/>

      <template v-for="(bonus, index) in getContent(depositContent, defaultLocaleDepositContent, 'bonuses')" :key="index">
        <atomic-bonus v-bind="bonus"/>
        <atomic-divider/>
      </template>

      <form-input-toggle
        name="bonus-toggle"
        v-model:value="hasBonusCode"
        @change="hasBonusCode = !hasBonusCode"
      >
        {{ getContent(depositContent, defaultLocaleDepositContent, 'togglerLabel') || '' }}
      </form-input-toggle>

      <form-bonus-code
        v-if="hasBonusCode"
        v-model:value="bonusValue"
      />
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
  const hasBonusCode = ref<boolean>(false);
  const bonusValue = ref<string>('');

  const walletStore = useWalletStore();
  const { showModal } = useLayoutStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);

  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
  } = useGlobalStore();

  const depositContent: Maybe<DepositInterface> = popupsData?.deposit;
  const defaultLocaleDepositContent: Maybe<DepositInterface> = defaultLocalePopupsData?.deposit;

  const { formatBalance, getContent } = useProjectMethods();
  const fieldHint = computed(() => {
    const formatSum = formatBalance(activeAccount.value?.currency, props.amountMin);
    return {
      message: `${getContent(depositContent, defaultLocaleDepositContent, 'minSum') || ''} ${formatSum.amount} ${formatSum.currency}`,
    };
  });

  onMounted(async () => {
    const profileStore = useProfileStore();
    if (profileStore.profile?.status === 2 && activeAccountType.value === 'fiat') {
      const { showAlert } = useLayoutStore();
      showAlert(getContent(alertsData, defaultLocaleAlertsData, 'limitedDeposit'));
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
  .input-toggle {
    width: 100%;
    --slider-bg: var(--black-primary);
  }

  .row {
    display: flex;
    min-height: rem(44px);
  }
}
</style>

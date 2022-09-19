<template>
  <form class="form-deposit">
    <form-input-number
      :hint="fieldHint"
      :label="depositContent?.sumLabel || ''"
      name="depositSum"
      :min="props.amountMin"
      :max="props.amountMax"
      v-model:value="amountValue"
      :defaultValue="amountDefaultValue"
      :currency="activeAccount.currency"
      :is-bigger="true"
    />

    <template v-if="depositContent?.bonuses?.length">
      <atomic-divider/>
      <template v-for="(bonus, index) in depositContent?.bonuses" :key="index">
        <atomic-bonus v-bind="bonus" />
        <atomic-divider />
      </template>
    </template>

    <div class="row">
      <form-input-toggle
        name="bonus-toggle"
        v-model:value="hasBonusCode"
        @change="hasBonusCode = !hasBonusCode"
      >
        {{ depositContent?.togglerLabel || '' }}
      </form-input-toggle>

      <form-input-text
        v-if="hasBonusCode"
        v-model:value="bonusValue"
        label=""
        :placeholder="fieldsContent?.bonusCode?.placeholder || ''"
        name="bonus-code"
      />
    </div>
    <button-base
      type="primary"
      size="md"
      :isDisabled="buttonDisabled"
      @click="getDeposit"
    >
      {{ depositContent?.depositButton }} {{ buttonAmount }} {{ activeAccount.currency }}
    </button-base>
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

  const { popupsData, fieldsContent, alertsData } = useGlobalStore();
  const depositContent: DepositInterface|undefined = popupsData?.deposit;

  const walletStore = useWalletStore();
  const { showModal } = useLayoutStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);
  const fieldHint = computed(() => ({
    message: `${depositContent?.minSum || ''} ${props.amountMin} ${activeAccount.value.currency}`,
  }));

  const isSending = ref<boolean>(false);
  const amountDefaultValue = ref<number>(activeAccountType.value === 'fiat' ? 20 : 0.01);
  const amountValue = ref<number>(amountDefaultValue.value);
  const hasBonusCode = ref<boolean>(false);
  const bonusValue = ref<string>('');
  const buttonAmount = computed(() => {
    if (amountValue.value > props.amountMax) return props.amountMax;
    if (amountValue.value < props.amountMin) return props.amountMin;
    return amountValue.value;
  });
  const buttonDisabled = computed(() => amountValue.value < props.amountMin || amountValue.value > props.amountMax || isSending.value);

  const getDeposit = async ():Promise<void> => {
    if (buttonDisabled.value) return;

    const profileStore = useProfileStore();
    if (profileStore.playerStatusName === 'Limited' && activeAccountType.value === 'fiat') {
      const { showAlert } = useLayoutStore();
      showAlert(alertsData?.limitedDeposit);
      return;
    }

    isSending.value = true;
    const locationQuery = window.location.search;
    const successRedirect = `${window.location.href}${locationQuery ? '&' : '?'}success=deposit`;
    const errorRedirect = `${window.location.href}${locationQuery ? '&' : '?'}error=deposit`;
    const params = {
      method: props.method,
      currency: activeAccount.value.currency,
      amount: Number(amountValue.value),
      accountId: activeAccount.value.id,
      redirectSuccessUrl: successRedirect,
      redirectErrorUrl: errorRedirect,
    };
    const { depositAccount } = useCoreWalletApi();
    const windowReference = window.open();
    try {
      const depositResponse = await depositAccount(params);
      console.log(depositResponse);
      const redirectUrl = depositResponse?.[0]?.action;
      windowReference.location = redirectUrl;
      setTimeout(() => { isSending.value = false; }, 1000);
    } catch {
      windowReference.close();
      isSending.value = false;
      showModal('error');
    }
  };
</script>

<style lang="scss" src="./style.scss"/>

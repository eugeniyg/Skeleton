<template>
  <div class="wallet-limit">
    <div class="wallet-limit__card">
      <div class="wallet-limit__card-title">
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.limit.title') }}
      </div>

      <div class="wallet-limit__card-sub-title">
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.limit.description') }}
      </div>

      <div v-if="limitValueText" class="wallet-limit__card-limit">
        {{ limitValueText }}
      </div>
    </div>

    <div class="wallet-limit__actions">
      <button-base type="primary" @click="goToLimits">
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.limit.moreInfo') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileLimits, IWalletModal } from '~/types';

  const props = defineProps<{
    currentLocaleLimitsContent: Maybe<IProfileLimits['coolingOff']>;
    defaultLocaleLimitsContent: Maybe<IProfileLimits['coolingOff']>;
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const { closeModal } = useModalStore();
  const { getContent, formatBalance, localizePath } = useProjectMethods();
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const { activeAccount } = storeToRefs(walletStore);

  const limitsStore = useLimitsStore();
  const { coolingOffLimits, activeLimits } = storeToRefs(limitsStore);

  const currentDepositLimit = computed(() => {
    return activeLimits.value.find(limit => {
      return (
        limit.definition === 3 &&
        limit.currency === activeAccount.value?.currency &&
        (limit.currentAmount ?? 0) >= (limit.amount ?? 0)
      );
    });
  });

  const limitValueText = computed(() => {
    const periodOptions = getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent,
      'constants.limitPeriods'
    );
    if (!periodOptions) return undefined;

    if (coolingOffLimits.value?.length) {
      const limitValue = getContent(
        props.currentLocaleLimitsContent,
        props.defaultLocaleLimitsContent,
        'coolingOff.label'
      );
      const limitPeriod = periodOptions[coolingOffLimits.value[0].period as string];
      return `${limitValue} - ${limitPeriod}`;
    }

    if (currentDepositLimit.value) {
      const { amount, currency } = formatBalance(
        currentDepositLimit.value.currency as string,
        currentDepositLimit.value.amount as number
      );
      const limitValue = `${amount} ${currency}`;
      const limitPeriod = periodOptions[currentDepositLimit.value.period as string];
      return `${limitValue} - ${limitPeriod}`;
    }

    return undefined;
  });

  const goToLimits = (): void => {
    const router = useRouter();
    closeModal('wallet');
    router.push(localizePath('/profile/limits'));
  };
</script>

<style src="~/assets/styles/components/wallet/limit.scss" lang="scss" />

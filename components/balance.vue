<template>
  <div class="balance">
    <div class="balance__rows">
      <div class="row" :class="{ 'row--compact': showEquivalentBalance }">
        <div class="label">{{ balanceLabel }}</div>

        <template v-if="props.withdraw">
          <div v-if="showEquivalentBalance" class="value">
            {{ activeEquivalentAccount.balance }} {{ activeEquivalentAccount.currency }}
          </div>

          <div :class="showEquivalentBalance ? 'converted-value' : 'value'">
            {{ balanceFormat.amount }} {{ balanceFormat.currency }}
          </div>
        </template>

        <div
          v-else
          v-click-outside="closeSelect"
          class="select"
          :class="{ 'is-open': isSelectOpen }"
          @click="toggleSelect"
        >
          <span class="amount">
            <span>{{ balanceFormat.amount }}</span>
            <span>{{ balanceFormat.currency }}</span>
          </span>

          <atomic-icon id="arrow_expand-close" class="icon-expand" />

          <list-currencies
            :is-open="isSelectOpen"
            hide-balance
            @hide-currencies-list="changingActiveAccount"
            @click.stop.prevent
            @change-active-account="onChangeAccount"
          />
        </div>
      </div>

      <div v-if="props.withdraw" class="row">
        <div class="label">
          {{ getContent(walletContent, defaultLocaleWalletContent, 'withdraw.withdrawLabel') }}
        </div>

        <div v-if="showEquivalentBalance" class="value">
          {{ withdrawalEquivalentBalanceFormat.balance }} {{ withdrawalEquivalentBalanceFormat.currency }}
        </div>

        <div :class="showEquivalentBalance ? 'converted-value' : 'value'">
          {{ withdrawalBalanceFormat.amount }} {{ withdrawalBalanceFormat.currency }}
        </div>
      </div>
    </div>
    <atomic-divider />
    <slot />
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';
  import { formatBalance, getEquivalentAccount } from '@skeleton/helpers/amountMethods';

  const props = defineProps({
    withdraw: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['changingAccount']);
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const walletStore = useWalletStore();
  const { activeAccount, activeEquivalentAccount, showEquivalentBalance } = storeToRefs(walletStore);
  const isSelectOpen = ref<boolean>(false);

  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));
  const withdrawalBalanceFormat = computed(() =>
    formatBalance(activeAccount.value?.currency, activeAccount.value?.withdrawalBalance)
  );
  const withdrawalEquivalentBalanceFormat = computed(() =>
    getEquivalentAccount(activeAccount.value?.withdrawalBalance, activeAccount.value?.currency)
  );

  const toggleSelect = () => {
    isSelectOpen.value = !isSelectOpen.value;
  };

  const closeSelect = () => {
    if (isSelectOpen.value) isSelectOpen.value = false;
  };

  const changingActiveAccount = (): void => {
    isSelectOpen.value = false;
    emit('changingAccount', true);
  };

  const onChangeAccount = async (): Promise<void> => {
    const { getTurnOverWager } = useRiskStore();
    await Promise.allSettled([walletStore.getDepositMethods(), walletStore.getWithdrawMethods(), getTurnOverWager()]);
    emit('changingAccount', false);
  };

  const balanceLabel = computed(() => {
    return props.withdraw
      ? getContent(walletContent, defaultLocaleWalletContent, 'withdraw.balanceLabel')
      : getContent(walletContent, defaultLocaleWalletContent, 'deposit.balanceLabel');
  });
</script>

<style src="~/assets/styles/components/balance.scss" lang="scss" />
